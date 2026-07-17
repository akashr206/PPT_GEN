import { layout_map } from "./layout_map";

const SlideLayout = ({ layoutCategory, layoutType, content, hero, ...rest }) => {
    const categoryKey = layoutCategory ? layoutCategory.toLowerCase() : "";
    let category = layout_map[categoryKey];

    // Fallback to bullets if category is missing or invalid (useful during streaming or AI hallucinations)
    if (!category) {
        category = layout_map["bullets"];
    }

    let Layout = category[layoutType];

    if (!Layout) {
        const fallbackKey = Object.keys(category).find(k => k === "standard" || k === "simple" || k === "asymmetric" || k === "thankyou" || k === "grid" || k === "split") || Object.keys(category)[0];
        Layout = category[fallbackKey];
    }

    if (!Layout) {
        Layout = layout_map["bullets"]["simple"];
    }

    return <Layout content={content} hero={hero} {...rest} />;
};

export default SlideLayout;
