import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from copy import deepcopy
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE_TYPE
from pptx.enum.text import MSO_AUTO_SIZE
from utils.themes import THEMES


class PPTEngine:
    SLIDE_HEIGHT = 10287000
    SLIDE_WIDTH = 18288000
    SLIDE_MAP = {
        "title": {"path": "templates/titles.pptx", "spt": 1, "total_types": 2},
        "bullets": {"path": "templates/bullets.pptx", "spt": 5, "total_types": 1},
        "boxes": {"path": "templates/boxes.pptx", "spt": 5, "total_types": 2},
        "skeleton": {"path": "templates/skeleton.pptx", "spt": 1, "total_types": 1}
    }

    def __init__(self, slides_content, theme_key="neon_rose"):
        if theme_key not in THEMES:
            raise ValueError(f"Theme '{theme_key}' is not defined in themes.py")
        self.theme_key = theme_key
        self.theme = THEMES[theme_key]
        self.colors = self.theme["colors"]
        self.fonts = self.theme["fonts"]
        self.slides_content = slides_content
        
    def build(self, custom_content=None):
        content = custom_content or self.slides_content
        prs = Presentation()
        prs.slide_width = self.SLIDE_WIDTH
        prs.slide_height = self.SLIDE_HEIGHT
        blank_layout = prs.slide_layouts[6]
        
        for i, slide_content in enumerate(content["slides"]):
            slide = prs.slides.add_slide(blank_layout)
            self._apply_background(slide)
            
            src_info = self.SLIDE_MAP[slide_content["type"]]
            skeleton = Presentation(self.SLIDE_MAP["skeleton"]["path"])
            layout = Presentation(src_info["path"])
            
            if slide_content["type"] == "title":
                layout_index = src_info["spt"] * slide_content["layout"]
                self._copy_slide(slide, layout.slides[layout_index])
            else:
                layout_index = (src_info["spt"] * slide_content["layout"]) + min(len(slide_content["items"]), src_info["spt"]) - 2
                self._copy_slide(slide, skeleton.slides[0])
                self._copy_slide(slide, layout.slides[layout_index])
            
            self._add_content(slide, slide_content, i, content)
            
        return prs

    def save(self, prs, filename : str = None):
        name = filename or f"outputs/pres_{self.theme_key}.pptx"
        try:
            prs.save(name)
            print(f"Successfully generated {name}")
        except PermissionError:
            print(f"Skipping theme '{self.theme_key}' due to PermissionError: please close '{name}' inside PowerPoint first!")

    def save_to_buffer(self, prs, buffer):
        prs.save(buffer)

    def _apply_background(self, slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = self.colors["background"]

    def _copy_slide(self, slide, source_slide):
        for shape in source_slide.shapes:
            slide.shapes._spTree.insert_element_before(
                deepcopy(shape.element),
                "p:extLst"
            )

    def _add_content(self, slide, slide_content, slide_index, full_content):
        replacements = {
            "{{title}}": slide_content.get("title", ""),
            "{{subtitle}}": slide_content.get("subtitle", ""),
            "{{presenter}}": full_content.get("presenter", ""),
            "{{pn}}": f"0{slide_index + 1}" if slide_index + 1 < 10 else str(slide_index + 1),
            "{{box}}": "",
        }

        for idx, item in enumerate(slide_content.get("items", [])):
            num = idx + 1
            replacements[f"{{{{h{num}}}}}"] = item.get("header", "")
            replacements[f"{{{{p{num}}}}}"] = item.get("description", "")
            replacements[f"{{{{n{num}}}}}"] = f"{num}"

        self._style_and_replace_shapes(slide.shapes, replacements)

    def _style_and_replace_shapes(self, shapes, replacements):

        for shape in shapes:
            if shape.shape_type == MSO_SHAPE_TYPE.GROUP:
                
                is_box_group = any(
                    hasattr(s, "text_frame") and s.text_frame and "{{box}}" in "".join(p.text for p in s.text_frame.paragraphs)
                    for s in shape.shapes
                )
                is_circle_group = any(
                    hasattr(s, "text_frame") and s.text_frame and (
                        any(("{{" + f"n{i}" + "}}") in "".join(p.text for p in s.text_frame.paragraphs) for i in range(1, 7)) or
                        "{{n}}" in "".join(p.text for p in s.text_frame.paragraphs)
                    )
                    for s in shape.shapes
                )

                for subshape in shape.shapes:
                    if is_box_group:
                        has_box_text = hasattr(subshape, "text_frame") and subshape.text_frame and any("{{box}}" in p.text for p in subshape.text_frame.paragraphs)
                        if not has_box_text and hasattr(subshape, "fill"):
                            subshape.fill.solid()
                            subshape.fill.fore_color.rgb = self.colors["primary"]
                    elif is_circle_group:
                        has_n_text = hasattr(subshape, "text_frame") and subshape.text_frame and (
                            any(("{{" + f"n{i}" + "}}") in p.text for i in range(1, 7) for p in subshape.text_frame.paragraphs) or
                            any("{{n}}" in p.text for p in subshape.text_frame.paragraphs)
                        )
                        if not has_n_text and hasattr(subshape, "fill"):
                            subshape.fill.solid()
                            subshape.fill.fore_color.rgb = self.colors["accent"]
                        elif has_n_text:
                            
                            
                            for paragraph in subshape.text_frame.paragraphs:
                                p_text = paragraph.text
                                found_placeholders = [ph for ph in replacements if ph in p_text]
                                if found_placeholders:
                                    if len(found_placeholders) == 1 and p_text.strip() == found_placeholders[0]:
                                        ph = found_placeholders[0]
                                        val = replacements[ph]
                                        if paragraph.runs:
                                            paragraph.runs[0].text = str(val)
                                            for r in paragraph.runs[1:]:
                                                r.text = ""
                                        else:
                                            paragraph.text = str(val)
                                    else:
                                        for run in paragraph.runs:
                                            for placeholder, value in replacements.items():
                                                if placeholder in run.text:
                                                    run.text = run.text.replace(placeholder, str(value))
                            
                            
                            for paragraph in subshape.text_frame.paragraphs:
                                for run in paragraph.runs:
                                    run.font.color.rgb = self.colors["accent_foreground"]
                                    run.font.name = self.fonts["heading"]

                self._style_and_replace_shapes(shape.shapes, replacements)
            else:
                if hasattr(shape, "text_frame") and shape.text_frame:
                    
                    
                    shape.text_frame.word_wrap = True
                    shape.text_frame.auto_size = MSO_AUTO_SIZE.SHAPE_TO_FIT_TEXT
                    
                    original_text = "".join(p.text for p in shape.text_frame.paragraphs)
                    
                    is_title_or_header = "{{title}}" in original_text or any(("{{" + f"h{i}" + "}}") in original_text for i in range(1, 7))
                    is_body_or_subtitle = "{{subtitle}}" in original_text or "{{presenter}}" in original_text or any(("{{" + f"p{i}" + "}}") in original_text for i in range(1, 7))
                    is_page_number = "{{pn}}" in original_text

                    
                    for paragraph in shape.text_frame.paragraphs:
                        p_text = paragraph.text
                        found_placeholders = [ph for ph in replacements if ph in p_text]
                        if found_placeholders:
                            if len(found_placeholders) == 1 and p_text.strip() == found_placeholders[0]:
                                ph = found_placeholders[0]
                                val = replacements[ph]
                                if paragraph.runs:
                                    paragraph.runs[0].text = str(val)
                                    for r in paragraph.runs[1:]:
                                        r.text = ""
                                else:
                                    paragraph.text = str(val)
                            else:
                                for run in paragraph.runs:
                                    for placeholder, value in replacements.items():
                                        if placeholder in run.text:
                                            run.text = run.text.replace(placeholder, str(value))

                    
                    if is_title_or_header:
                        for paragraph in shape.text_frame.paragraphs:
                            for run in paragraph.runs:
                                run.font.color.rgb = self.colors["title"]
                                run.font.name = self.fonts["title"] if "{{title}}" in original_text else self.fonts["heading"]
                    elif is_body_or_subtitle:
                        for paragraph in shape.text_frame.paragraphs:
                            for run in paragraph.runs:
                                run.font.color.rgb = self.colors["primary_foreground"]
                                run.font.name = self.fonts["body"]
                    elif is_page_number:
                        for paragraph in shape.text_frame.paragraphs:
                            for run in paragraph.runs:
                                run.font.color.rgb = self.colors["secondary_foreground"]
                                run.font.name = self.fonts["body"]
                    else:
                        for paragraph in shape.text_frame.paragraphs:
                            for run in paragraph.runs:
                                run.font.name = self.fonts["body"]

# if __name__ == "__main__":
    
#     for theme_key in THEMES:
#         from slides_content import slides_content
#         engine = PPTEngine(slides_content, theme_key)
#         presentation = engine.build()
#         engine.save(presentation)