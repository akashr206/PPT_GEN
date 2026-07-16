import { layout_map } from "./layout_map";

const SlideLayout = ({ layoutCategory, layoutType, content, hero, ...rest }) => {
    const categoryKey = layoutCategory ? layoutCategory.toLowerCase() : "";
    const category = layout_map[categoryKey];

    if (!category) {
        console.error(`Layout category "${layoutCategory}" not found in layout_map.`);
        return (
            <div className="flex items-center justify-center h-full w-full border border-dashed border-red-500/30 bg-red-500/5 p-8 rounded text-red-500 text-sm font-mono">
                Error: Layout category &quot;{layoutCategory}&quot; not found
            </div>
        );
    }

    let Layout = category[layoutType];

    if (!Layout) {
        console.warn(`Layout type "${layoutType}" not found in category "${layoutCategory}". Falling back to first available layout.`);
        const fallbackKey = Object.keys(category).find(k => k === "standard" || k === "simple" || k === "asymmetric" || k === "thankyou" || k === "grid" || k === "split") || Object.keys(category)[0];
        Layout = category[fallbackKey];
    }

    if (!Layout) {
        return (
            <div className="flex items-center justify-center h-full w-full border border-dashed border-red-500/30 bg-red-500/5 p-8 rounded text-red-500 text-sm font-mono">
                Error: Layout type &quot;{layoutType}&quot; not found in category &quot;{layoutCategory}&quot;
            </div>
        );
    }

    return <Layout content={content} hero={hero} {...rest} />;
};

export default SlideLayout;
