import os
import sys
import win32com.client

def export_slides():
    base_dir = r"c:\Users\Ztzrk\Documents\fieldmax"
    pptx_path = os.path.join(base_dir, "obsidian", "Fieldmax", "exports", "Presentasi_Seminar_Hasil_FieldMax.pptx")
    out_dir = os.path.join(base_dir, "obsidian", "Fieldmax", "exports", "slide_exports")
    os.makedirs(out_dir, exist_ok=True)

    powerpoint = win32com.client.Dispatch("PowerPoint.Application")
    # Open presentation in read-only and without window to avoid blocking
    pres = powerpoint.Presentations.Open(pptx_path, WithWindow=False)
    
    # 17 = ppSaveAsPNG
    pres.SaveAs(out_dir, 17)
    pres.Close()
    powerpoint.Quit()

    files = sorted(os.listdir(out_dir))
    print(f"[SUCCESS] Exported {len(files)} slide images to: {out_dir}")
    for f in files[:5]:
        print("  -", f)

if __name__ == "__main__":
    export_slides()
