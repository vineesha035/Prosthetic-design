import trimesh
import numpy as np
import os

def generate_prosthetic_glb(color_hex, output_path="exported.glb"):
    """Generate a basic prosthetic leg GLB model with the given color."""
    
    print(f"Generating 3D prosthetic leg model...")
    
    # Create the main leg shaft (cylinder)
    leg_shaft = trimesh.creation.cylinder(
        radius=0.05,
        height=0.4,
        sections=32
    )
    
    # Create the top connector (wider cylinder)
    top_connector = trimesh.creation.cylinder(
        radius=0.07,
        height=0.05,
        sections=32
    )
    
    # Create the foot (ellipsoid-like shape)
    foot = trimesh.creation.cylinder(
        radius=0.06,
        height=0.03,
        sections=32
    )
    
    # Position the parts
    top_connector.apply_translation([0, 0, 0.22])
    foot.apply_translation([0, 0, -0.22])
    
    # Combine all parts
    leg = trimesh.util.concatenate([leg_shaft, top_connector, foot])
    
    # Apply color
    color_rgb = hex_to_rgb(color_hex)
    leg.visual.vertex_colors = np.tile(
        color_rgb + [255],
        (len(leg.vertices), 1)
    )
    
    # Export as GLB
    leg.export(output_path)
    print(f"GLB model saved to: {output_path}")
    return output_path

def hex_to_rgb(hex_color):
    """Convert hex color to RGB list."""
    hex_color = hex_color.lstrip('#')
    return [int(hex_color[i:i+2], 16) for i in (0, 2, 4)]

# Color mapping
COLOR_MAP = {
    "Ocean Blue": "#1a6eb5",
    "Matte Black": "#333333",
    "Neon Pink": "#ff1493",
    "Forest Green": "#2d8a4e",
    "Sunset Orange": "#e8611a",
    "Titanium Silver": "#a8a9ad",
}

if __name__ == "__main__":
    import sys
    
    # Get color from environment or default
    color = os.getenv("DESIGN_COLOR", "Ocean Blue")
    output_path = os.getenv("GLB_OUTPUT", "exported.glb")
    
    hex_color = COLOR_MAP.get(color, "#333333")
    output = generate_prosthetic_glb(hex_color, output_path)
    print(f"Generated: {output}")
    size = os.path.getsize(output)
    print(f"File size: {size} bytes ({size/1024:.1f} KB)")