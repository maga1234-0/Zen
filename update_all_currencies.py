#!/usr/bin/env python3
"""
Script to update all currency displays in the codebase
to use the new formatPrice() hook with Forex conversion
"""

import re
import os

files_to_update = [
    'client/src/pages/Restaurant.tsx',
    'client/src/pages/Spa.tsx',
    'client/src/pages/Payments.tsx',
    'client/src/pages/FrontDesk.tsx',
]

def add_import_if_missing(content):
    """Add currency import if not present"""
    if 'useCurrencyFormat' in content:
        return content
    
    # Find where to add the import (after other imports)
    import_pattern = r"(import.*?from ['\"].*?['\"];?\n)"
    matches = list(re.finditer(import_pattern, content))
    
    if matches:
        last_import = matches[-1]
        insert_pos = last_import.end()
        new_import = "import { useCurrencyFormat } from '@/utils/currency';\n"
        content = content[:insert_pos] + new_import + content[insert_pos:]
    
    return content

def add_hook_if_missing(content):
    """Add formatPrice hook if not present"""
    if 'formatPrice' in content and 'useCurrencyFormat' in content:
        return content
    
    # Find component declaration
    component_pattern = r"(export (?:const|function) \w+ = \(\) => \{)\n"
    match = re.search(component_pattern, content)
    
    if match:
        insert_pos = match.end()
        hook_line = "  const { formatPrice } = useCurrencyFormat();\n"
        content = content[:insert_pos] + hook_line + content[insert_pos:]
    
    return content

def replace_euro_displays(content):
    """Replace {amount}€ with {formatPrice(amount)}"""
    # Pattern: {something}€
    content = re.sub(r'\{([^}]+)\}€', r'{formatPrice(\1)}', content)
    
    # Pattern: something€ in strings
    content = re.sub(r'`([^`]*?)\{([^}]+)\}€([^`]*?)`', r'`\1{formatPrice(\2)}\3`', content)
    
    return content

def replace_dollar_displays(content):
    """Replace ${amount} with {formatPrice(amount)} in JSX"""
    # Be careful not to replace template literals
    # Pattern: ${amount} in JSX (not in strings)
    lines = content.split('\n')
    new_lines = []
    
    for line in lines:
        # Skip lines that are clearly template strings
        if '`' in line or 'await api' in line or 'console' in line:
            new_lines.append(line)
            continue
            
        # Replace ${ in JSX contexts
        if '${' in line and ('>' in line or 'className' in line or 'value=' in line):
            line = re.sub(r'\$\{([^}]+)\}', r'{formatPrice(\1)}', line)
        
        new_lines.append(line)
    
    return '\n'.join(new_lines)

def process_file(filepath):
    """Process a single file"""
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return False
    
    print(f"📝 Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Add import
    content = add_import_if_missing(content)
    
    # Add hook
    content = add_hook_if_missing(content)
    
    # Replace currency displays
    content = replace_euro_displays(content)
    content = replace_dollar_displays(content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {filepath}")
        return True
    else:
        print(f"ℹ️  No changes needed: {filepath}")
        return False

def main():
    """Main function"""
    print("🚀 Starting currency display updates...")
    print("=" * 50)
    
    updated_count = 0
    for filepath in files_to_update:
        if process_file(filepath):
            updated_count += 1
        print()
    
    print("=" * 50)
    print(f"✨ Done! Updated {updated_count}/{len(files_to_update)} files")

if __name__ == '__main__':
    main()
