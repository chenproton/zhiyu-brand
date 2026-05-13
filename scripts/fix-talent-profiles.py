import re

with open('/root/zhiyu-brand/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

colleges = [
    '智能制造学院', '信息技术学院', '经济管理学院', '艺术设计学院',
    '新能源工程学院', '生物医药学院', '现代服务学院', '国际教育学院', '创新创业学院',
]

# Find talentProfiles array
start_marker = 'export const talentProfiles: TalentProfile[] = ['
start = content.find(start_marker)
if start == -1:
    print("talentProfiles not found")
    exit(1)

# Find the next export const
next_export = content.find('\nexport const ', start + len(start_marker))
if next_export == -1:
    scope_end = len(content)
else:
    scope_end = next_export

scope = content[start:scope_end]

# Find all object blocks
blocks = list(re.finditer(r'\{\s*\n\s*id:\s*"tp\d+"', scope))
print(f"Found {len(blocks)} talent profile blocks")

modified = 0
for i in range(len(blocks) - 1, -1, -1):
    m = blocks[i]
    college = colleges[i % len(colleges)]
    block_start = m.start()
    
    # Find end of this object
    end_match = re.search(r'\n\}\s*(?:,|\])', scope[block_start:])
    if not end_match:
        continue
    block_end = block_start + end_match.start()
    block = scope[block_start:block_end]
    
    if 'secondaryCollege' in block:
        continue
    
    # talentProfiles only have updatedAt, not createdAt
    target_match = re.search(r'(\n\s+updatedAt:)', block)
    if target_match:
        insert_pos = block_start + target_match.start()
        scope = scope[:insert_pos] + f"\n  secondaryCollege: '{college}'," + scope[insert_pos:]
        modified += 1

content = content[:start] + scope + content[scope_end:]

with open('/root/zhiyu-brand/lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Modified {modified} talent profiles")
