#!/bin/bash

# Strategic commit script for Keymint docs cleanup
# This script commits files in logical groups with meaningful messages

set -e  # Exit on any error

echo "🚀 Starting strategic commits for Keymint docs cleanup..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Function to commit if file exists and has changes
commit_if_changed() {
    local file="$1"
    local message="$2"
    
    if [ -f "$file" ] && git diff --quiet "$file" 2>/dev/null; then
        echo "⏭️  Skipping $file (no changes)"
        return
    fi
    
    if [ -f "$file" ]; then
        git add "$file"
        git commit -m "$message"
        echo "✅ Committed: $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Function to commit multiple files with one message
commit_group() {
    local message="$1"
    shift
    local files=("$@")
    local has_changes=false
    
    for file in "${files[@]}"; do
        if [ -f "$file" ] && ! git diff --quiet "$file" 2>/dev/null; then
            git add "$file"
            has_changes=true
            echo "📝 Staged: $file"
        fi
    done
    
    if [ "$has_changes" = true ]; then
        git commit -m "$message"
        echo "✅ Committed group: $message"
    else
        echo "⏭️  Skipping group (no changes): $message"
    fi
}

echo ""
echo "📋 Phase 1: Core configuration and branding updates..."

# 1. Core configuration file
commit_if_changed "docs.json" "feat: update docs.json with Keymint branding and navigation structure

- Replace Mintlify branding with Keymint-specific content
- Update navigation to reflect actual file structure
- Configure proper favicon, logo, and color scheme
- Add GitHub social link and support contact
- Restore \$schema for IDE support"

# 2. Main README
commit_if_changed "README.md" "docs: update README with Keymint-specific content and accurate setup instructions

- Replace generic Mintlify content with Keymint project description
- Add accurate local development setup using Mintlify CLI
- Include proper installation and troubleshooting steps
- Remove marketing content while keeping technical accuracy"

echo ""
echo "📋 Phase 2: Documentation content cleanup..."

# 3. Development guide
commit_if_changed "development.mdx" "docs: restore comprehensive development guide with Mintlify CLI instructions

- Add complete local development setup using Mintlify CLI
- Include installation, running, and troubleshooting sections
- Remove unnecessary Mintlify marketing while keeping technical content
- Ensure accuracy for contributors setting up the docs locally"

# 4. Main pages cleanup
commit_group "docs: clean up main documentation pages and remove legacy content

- Remove Mintlify marketing content from quickstart guide
- Update examples and links to be Keymint-specific
- Clean up settings, navigation, and markdown guides
- Remove plant store references and generic examples" \
    "quickstart.mdx" \
    "index.mdx" \
    "essentials/settings.mdx" \
    "essentials/navigation.mdx" \
    "essentials/markdown.mdx" \
    "essentials/images.mdx"

# 5. AI tools documentation
commit_group "docs: update AI tools documentation with Keymint-specific examples

- Replace generic examples with Keymint API references
- Update Windsurf and other AI tool configurations
- Remove marketing content while keeping technical guidance" \
    "ai-tools/windsurf.mdx" \
    "ai-tools/cursor.mdx" \
    "ai-tools/claude-code.mdx"

echo ""
echo "📋 Phase 3: API documentation overhaul..."

# 6. OpenAPI specification
commit_if_changed "api-reference/openapi.json" "feat: completely rewrite OpenAPI spec to match actual Keymint API

- Replace legacy plant store endpoints with real Keymint endpoints
- Add comprehensive schemas for all request/response types
- Include all endpoints: create-key, activate-key, get-key, deactivate-key, block-key, unblock-key
- Add proper HTTP status codes and error responses matching MDX documentation
- Ensure 100% alignment between OpenAPI spec and API documentation"

# 7. API reference pages
commit_group "docs: update API reference documentation with accurate Keymint endpoints

- Ensure all API documentation reflects actual Keymint API behavior
- Update authentication, rate limits, and error code documentation
- Remove any remaining legacy references" \
    "api-reference/introduction.mdx" \
    "api-reference/overview.mdx" \
    "api-reference/authentication.mdx" \
    "api-reference/rate-limits.mdx" \
    "api-reference/error-codes.mdx"

# 8. License API endpoints
commit_group "docs: verify license API documentation accuracy

- Ensure create, activate, get, deactivate endpoints match implementation
- Verify block/unblock functionality documentation
- Confirm all parameters, responses, and error codes are accurate" \
    "api-reference/licenses/create.mdx" \
    "api-reference/licenses/activate.mdx" \
    "api-reference/licenses/get.mdx" \
    "api-reference/licenses/deactivate.mdx" \
    "api-reference/licenses/block.mdx" \
    "api-reference/licenses/unblock.mdx"

echo ""
echo "📋 Phase 4: Supporting documentation..."

# 9. SDK documentation
commit_group "docs: update SDK documentation for Keymint integration

- Ensure Node.js and Python SDK examples are Keymint-specific
- Remove any legacy examples or references" \
    "sdks/nodejs.mdx" \
    "sdks/python.mdx"

# 10. Security and topics
commit_group "docs: update security and topic documentation

- Ensure security documentation reflects Keymint practices
- Update offline key topics and other guides" \
    "security/index.mdx" \
    "topics/offline-key.mdx"

# 11. Help and support
commit_group "docs: update help and support documentation

- Update FAQ with Keymint-specific information
- Ensure customer portal documentation is accurate" \
    "help/faqs.mdx" \
    "help/customer-portal/login.mdx"

# 12. Snippets and reusable content
if [ -d "snippets" ]; then
    commit_group "docs: update reusable snippets and components

- Ensure all snippets use Keymint-specific examples
- Remove any legacy content from reusable components" \
        "snippets/"*
fi

echo ""
echo "📋 Phase 5: Asset cleanup..."

# 13. Remove local favicon if it exists (we deleted it)
if git ls-files --error-unmatch favicon.svg > /dev/null 2>&1; then
    git rm favicon.svg
    git commit -m "feat: remove local favicon to use remote Keymint favicon

- Delete local favicon.svg file
- Allow docs.json favicon setting to use remote Keymint favicon
- Ensures consistent branding across all platforms"
    echo "✅ Removed local favicon"
fi

# 14. Remove legacy endpoint directory if it was removed
if git status --porcelain | grep -q "api-reference/endpoint/"; then
    git add api-reference/endpoint/
    git commit -m "refactor: remove legacy generic API endpoint files

- Remove generic endpoint templates that don't match actual API
- Clean up navigation to focus on specific license management endpoints
- Consolidate API documentation under proper license-specific endpoints"
    echo "✅ Removed legacy endpoint directory"
fi

echo ""
echo "📋 Phase 6: Final cleanup..."

# 15. Any remaining files
if ! git diff --quiet; then
    echo "📝 Checking for any remaining uncommitted changes..."
    git status --porcelain
    
    read -p "🤔 Commit all remaining changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore: commit any remaining cleanup changes

- Final cleanup of any missed files or minor adjustments
- Ensure repository is clean and ready for production"
        echo "✅ Committed remaining changes"
    fi
fi

echo ""
echo "🎉 Strategic commit process completed!"
echo ""
echo "📊 Commit summary:"
git log --oneline -10
echo ""
echo "🔍 Repository status:"
git status
echo ""
echo "✨ All Keymint documentation cleanup changes have been strategically committed!"
echo "🚀 Your documentation is now ready for deployment with accurate API specs and clean branding."
