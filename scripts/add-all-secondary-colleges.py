import re

# Read file
with open('/root/zhiyu-brand/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Secondary colleges to assign cyclically
colleges = [
    '智能制造学院',
    '信息技术学院',
    '经济管理学院',
    '艺术设计学院',
    '新能源工程学院',
    '生物医药学院',
    '现代服务学院',
    '国际教育学院',
    '创新创业学院',
]

def add_secondary_college_to_array(array_name, id_pattern):
    """Add secondaryCollege to all items in a mock data array."""
    global content
    # Find the array declaration
    array_decl = f'export const {array_name}'
    array_start = content.find(array_decl)
    if array_start == -1:
        print(f"Array {array_name} not found")
        return
    
    # Find the next export const or end of file to limit scope
    next_export = content.find('export const ', array_start + len(array_decl))
    if next_export == -1:
        scope_end = len(content)
    else:
        scope_end = next_export
    
    scope = content[array_start:scope_end]
    
    # Find all object blocks in this scope
    # Look for objects that don't already have secondaryCollege
    blocks = list(re.finditer(id_pattern, scope))
    modified_count = 0
    
    # Process from end to start to avoid position shifts
    for i in range(len(blocks) - 1, -1, -1):
        m = blocks[i]
        college = colleges[i % len(colleges)]
        start = m.start()
        
        # Find the end of this object block
        end_match = re.search(r'\n\}\s*(?:,|\])', scope[start:])
        if not end_match:
            continue
        
        end = start + end_match.start()
        block = scope[start:end]
        
        # Skip if already has secondaryCollege
        if 'secondaryCollege' in block:
            continue
        
        # Find createdAt to insert before
        created_at_match = re.search(r'(\n\s+createdAt:)', block)
        if created_at_match:
            insert_pos = start + created_at_match.start()
            # Insert in the scope
            scope = scope[:insert_pos] + f"\n  secondaryCollege: '{college}'," + scope[insert_pos:]
            modified_count += 1
    
    # Update content
    content = content[:array_start] + scope + content[scope_end:]
    print(f"{array_name}: added secondaryCollege to {modified_count} entries")

# Add to all arrays that need it
# Partners use 'e' prefix IDs like enterprises
add_secondary_college_to_array('partners', r'\{\s*\n\s*id:\s*"(e\d+)"')

# Talent profiles use 'tp' prefix
add_secondary_college_to_array('talentProfiles', r'\{\s*\n\s*id:\s*"(tp\d+)"')

# Employment cases use 'ec' prefix
add_secondary_college_to_array('employmentCases', r'\{\s*\n\s*id:\s*"(ec\d+)"')

# Teacher brands use 'tb' prefix
add_secondary_college_to_array('teacherBrands', r'\{\s*\n\s*id:\s*"(tb\d+)"')

# Job brands use 'jb' prefix
add_secondary_college_to_array('jobBrands', r'\{\s*\n\s*id:\s*"(jb\d+)"')

# Major brands use 'mb' prefix
add_secondary_college_to_array('majorBrands', r'\{\s*\n\s*id:\s*"(mb\d+)"')

# Culture brands use 'cb' prefix
add_secondary_college_to_array('cultureBrands', r'\{\s*\n\s*id:\s*"(cb\d+)"')

# Employment projects use 'ep' prefix
add_secondary_college_to_array('employmentProjects', r'\{\s*\n\s*id:\s*"(ep\d+)"')

with open('/root/zhiyu-brand/lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done adding secondaryCollege fields to all arrays")
