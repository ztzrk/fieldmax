import math
import os

# Define output path
output_path = r"c:\Users\Ztzrk\Documents\fieldmax\obsidian\Fieldmax\images\gambar-erd-fieldmax.drawio"

# XML generator functions
def make_vertex(id_str, value, x, y, w, h, style):
    value_escaped = value.replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    return f'        <mxCell id="{id_str}" value="{value_escaped}" style="{style}" vertex="1" parent="1">\n          <mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/>\n        </mxCell>'

def make_edge(id_str, source_id, target_id, style, value=""):
    value_escaped = value.replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    return f'        <mxCell id="{id_str}" value="{value_escaped}" style="{style}" edge="1" source="{source_id}" target="{target_id}" parent="1">\n          <mxGeometry relative="1" as="geometry"/>\n        </mxCell>'

# Define styles
style_entity = "rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;fontColor=#000000;fontStyle=1;fontSize=12;"
style_attribute = "ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;fontColor=#000000;fontSize=10;"
style_relationship = "rhombus;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;fontColor=#000000;fontStyle=0;fontSize=11;align=center;"
style_edge = "edgeStyle=none;endArrow=none;strokeColor=#000000;html=1;labelBackgroundColor=#ffffff;fontSize=10;"

# Entity positions (x, y)
entities = {
    "VerificationToken": (100, 100),
    "ResetToken": (100, 300),
    "Session": (100, 500),
    "ReportReply": (100, 750),
    
    "User": (380, 450),
    "UserProfile": (380, 150),
    "Report": (380, 750),
    
    "VenueSchedule": (680, 150),
    "Venue": (680, 450),
    "VenuePhoto": (680, 750),
    
    "SportType": (980, 150),
    "Field": (980, 450),
    "FieldPhoto": (980, 750),
    
    "Payment": (1280, 150),
    "Booking": (1280, 450),
    "Review": (1280, 750),
}

entity_sizes = {
    "VerificationToken": (160, 60),
    "ResetToken": (140, 60),
    "Session": (140, 60),
    "ReportReply": (140, 60),
    "User": (140, 60),
    "UserProfile": (140, 60),
    "Report": (140, 60),
    "VenueSchedule": (140, 60),
    "Venue": (140, 60),
    "VenuePhoto": (140, 60),
    "SportType": (140, 60),
    "Field": (140, 60),
    "FieldPhoto": (140, 60),
    "Payment": (140, 60),
    "Booking": (140, 60),
    "Review": (140, 60),
}

# Attributes per entity
attributes = {
    "User": ["id", "fullName", "email", "password", "phoneNumber", "role", "isVerified", "createdAt"],
    "VerificationToken": ["identifier", "token", "expires"],
    "ResetToken": ["id", "token", "expires", "userId", "createdAt"],
    "UserProfile": ["userId", "profilePictureUrl", "bio", "address", "updatedAt", "companyDescription", "companyLogoUrl", "companyName", "companyWebsite"],
    "SportType": ["id", "name"],
    "Venue": ["id", "renterId", "name", "address", "city", "district", "province", "postalCode", "description", "createdAt", "status", "rejectionReason"],
    "VenueSchedule": ["id", "venueId", "dayOfWeek", "openTime", "closeTime"],
    "VenuePhoto": ["id", "venueId", "url", "isFeatured", "createdAt"],
    "Field": ["id", "venueId", "sportTypeId", "description", "pricePerHour", "createdAt", "status", "name", "isClosed", "rejectionReason"],
    "FieldPhoto": ["id", "fieldId", "url", "isFeatured", "createdAt"],
    "Booking": ["id", "userId", "fieldId", "bookingDate", "startTime", "endTime", "totalPrice", "status", "createdAt"],
    "Payment": ["id", "bookingId", "amount", "status", "snapToken", "paymentRedirectUrl", "createdAt", "updatedAt"],
    "Review": ["id", "rating", "comment", "userId", "fieldId", "bookingId", "createdAt"],
    "Session": ["id", "userId", "expiresAt"],
    "Report": ["id", "userId", "subject", "description", "category", "status", "createdAt", "updatedAt"],
    "ReportReply": ["id", "reportId", "senderId", "message", "createdAt"],
}

# Direction to place attributes relative to the entity center
attribute_directions = {
    "VerificationToken": "top",
    "ResetToken": "left",
    "Session": "left",
    "ReportReply": "left",
    
    "User": "circle",
    "UserProfile": "top",
    "Report": "left",
    
    "VenueSchedule": "top",
    "Venue": "circle",
    "VenuePhoto": "bottom",
    
    "SportType": "top",
    "Field": "circle",
    "FieldPhoto": "bottom",
    
    "Payment": "top",
    "Booking": "right",
    "Review": "bottom",
}

# Relationships
# (Entity1, Entity2, RelationshipName, Card1, Card2, Rx, Ry)
relationships = [
    # User relations
    ("User", "ResetToken", "Memiliki", "1", "M", 240, 380),
    ("User", "Session", "Memiliki", "1", "M", 240, 480),
    ("User", "UserProfile", "Memiliki", "1", "1", 380, 300),
    ("User", "Venue", "Memiliki", "1", "M", 530, 450),
    ("User", "Booking", "Memiliki", "1", "M", 830, 380),
    ("User", "Review", "Memiliki", "1", "M", 830, 600),
    ("User", "Report", "Memiliki", "1", "M", 380, 600),
    ("User", "ReportReply", "Memiliki", "1", "M", 240, 620),
    
    # Venue relations
    ("Venue", "VenueSchedule", "Memiliki", "1", "M", 680, 300),
    ("Venue", "VenuePhoto", "Memiliki", "1", "M", 680, 600),
    ("Venue", "Field", "Memiliki", "1", "M", 830, 450),
    
    # Field relations
    ("Field", "FieldPhoto", "Memiliki", "1", "M", 980, 600),
    ("Field", "SportType", "Memiliki", "M", "1", 980, 300),
    ("Field", "Booking", "Memiliki", "1", "M", 1130, 450),
    ("Field", "Review", "Memiliki", "1", "M", 1130, 600),
    
    # Booking relations
    ("Booking", "Payment", "Memiliki", "1", "1", 1280, 300),
    ("Booking", "Review", "Memiliki", "1", "1", 1280, 600),
    
    # Report relations
    ("Report", "ReportReply", "Memiliki", "1", "M", 240, 750),
]

xml_parts = []
xml_parts.append('<mxfile host="app.diagrams.net" modified="2026-07-17T00:00:00.000Z" agent="Obsidian Diagrams Plugin" version="24.0.0">')
xml_parts.append('  <diagram id="fieldmax-erd" name="ERD FieldMax">')
xml_parts.append('    <mxGraphModel adaptiveColors="auto">')
xml_parts.append('      <root>')
xml_parts.append('        <mxCell id="0"/>')
xml_parts.append('        <mxCell id="1" parent="0"/>')

entity_cell_ids = {}
for ent, pos in entities.items():
    ew, eh = entity_sizes.get(ent, (140, 60))
    ex, ey = pos
    id_str = f"ent_{ent}"
    entity_cell_ids[ent] = id_str
    
    # Format name neatly
    display_name = ent
    if ent == "VerificationToken":
        display_name = "Verification Token"
    elif ent == "ResetToken":
        display_name = "Reset Token"
    elif ent == "UserProfile":
        display_name = "User Profile"
    elif ent == "VenueSchedule":
        display_name = "Venue Schedule"
    elif ent == "VenuePhoto":
        display_name = "Venue Photo"
    elif ent == "SportType":
        display_name = "Sport Type"
    elif ent == "FieldPhoto":
        display_name = "Field Photo"
    elif ent == "ReportReply":
        display_name = "Report Reply"
        
    xml_parts.append(make_vertex(id_str, display_name, ex, ey, ew, eh, style_entity))

# Draw attributes
for ent, attrs in attributes.items():
    ex, ey = entities[ent]
    ew, eh = entity_sizes.get(ent, (140, 60))
    direction = attribute_directions.get(ent, "bottom")
    
    num_attrs = len(attrs)
    for i, attr in enumerate(attrs):
        attr_id = f"attr_{ent}_{attr.replace('.', 'dot')}"
        aw, ah = 90, 45
        
        if direction == "top":
            span = 100 * (num_attrs - 1)
            ax = ex + ew/2 - aw/2 - span/2 + i * 100
            ay = ey - 80
        elif direction == "bottom":
            span = 100 * (num_attrs - 1)
            ax = ex + ew/2 - aw/2 - span/2 + i * 100
            ay = ey + eh + 40
        elif direction == "left":
            span = 60 * (num_attrs - 1)
            ax = ex - aw - 50
            ay = ey + eh/2 - ah/2 - span/2 + i * 60
        elif direction == "right":
            span = 60 * (num_attrs - 1)
            ax = ex + ew + 50
            ay = ey + eh/2 - ah/2 - span/2 + i * 60
        else:  # circle
            angle = (i / num_attrs) * 2 * math.pi
            ax = ex + ew/2 - aw/2 + 130 * math.cos(angle)
            ay = ey + eh/2 - ah/2 + 90 * math.sin(angle)
            
        xml_parts.append(make_vertex(attr_id, attr, int(ax), int(ay), aw, ah, style_attribute))
        xml_parts.append(make_edge(f"edge_attr_{ent}_{attr}", attr_id, entity_cell_ids[ent], style_edge))

# Draw relationships
for idx, rel in enumerate(relationships):
    ent1, ent2, rel_name, card1, card2, rx, ry = rel
    rel_id = f"rel_{idx}_{rel_name}"
    rw, rh = 110, 60
    
    xml_parts.append(make_vertex(rel_id, rel_name, rx - rw/2, ry - rh/2, rw, rh, style_relationship))
    xml_parts.append(make_edge(f"edge_rel_{idx}_1", entity_cell_ids[ent1], rel_id, style_edge, card1))
    xml_parts.append(make_edge(f"edge_rel_{idx}_2", rel_id, entity_cell_ids[ent2], style_edge, card2))

xml_parts.append('      </root>')
xml_parts.append('    </mxGraphModel>')
xml_parts.append('  </diagram>')
xml_parts.append('</mxfile>')

# Write to file
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(xml_parts))

print(f"Generated draw.io diagram successfully at: {output_path}")
