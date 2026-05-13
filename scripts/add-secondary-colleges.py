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

# Add secondaryCollege to experts
expert_pattern = r'(export const experts: Expert\[\] = \[)'
def add_expert_colleges(match):
    return match.group(1)

# Process experts: find each expert object and add secondaryCollege before createdAt
expert_blocks = list(re.finditer(r'\{\s*\n\s*id:\s*"(ex\d+)"', content))
for i, m in enumerate(expert_blocks):
    college = colleges[i % len(colleges)]
    expert_id = m.group(1)
    # Find the createdAt line for this expert and insert before it
    # Search from current position to next expert or end of array
    start = m.start()
    # Find the end of this expert object (next `},` at start of line or end of array)
    end_match = re.search(r'\n\}\s*(?:,|\])', content[start:])
    if end_match:
        end = start + end_match.start()
        # Find createdAt within this block
        created_at_match = re.search(r'(\n\s+createdAt:)', content[start:end])
        if created_at_match:
            insert_pos = start + created_at_match.start()
            content = content[:insert_pos] + f"\n  secondaryCollege: '{college}'," + content[insert_pos:]

# Add secondaryCollege to enterprises
enterprise_blocks = list(re.finditer(r'\{\s*\n\s*id:\s*"(e\d+)"', content))
for i, m in enumerate(enterprise_blocks):
    college = colleges[i % len(colleges)]
    start = m.start()
    end_match = re.search(r'\n\}\s*(?:,|\])', content[start:])
    if end_match:
        end = start + end_match.start()
        created_at_match = re.search(r'(\n\s+createdAt:)', content[start:end])
        if created_at_match:
            insert_pos = start + created_at_match.start()
            content = content[:insert_pos] + f"\n  secondaryCollege: '{college}'," + content[insert_pos:]

# Add secondaryCollege to projects
project_blocks = list(re.finditer(r'\{\s*\n\s*id:\s*"(proj\d+|p\d+)"', content))
for i, m in enumerate(project_blocks):
    college = colleges[i % len(colleges)]
    start = m.start()
    end_match = re.search(r'\n\}\s*(?:,|\])', content[start:])
    if end_match:
        end = start + end_match.start()
        created_at_match = re.search(r'(\n\s+createdAt:)', content[start:end])
        if created_at_match:
            insert_pos = start + created_at_match.start()
            content = content[:insert_pos] + f"\n  secondaryCollege: '{college}'," + content[insert_pos:]

# Add secondaryCollege to achievements
achievement_blocks = list(re.finditer(r'\{\s*\n\s*id:\s*"(ach\d+|a\d+)"', content))
for i, m in enumerate(achievement_blocks):
    college = colleges[i % len(colleges)]
    start = m.start()
    end_match = re.search(r'\n\}\s*(?:,|\])', content[start:])
    if end_match:
        end = start + end_match.start()
        created_at_match = re.search(r'(\n\s+createdAt:)', content[start:end])
        if created_at_match:
            insert_pos = start + created_at_match.start()
            content = content[:insert_pos] + f"\n  secondaryCollege: '{college}'," + content[insert_pos:]

with open('/root/zhiyu-brand/lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done adding secondaryCollege fields")
