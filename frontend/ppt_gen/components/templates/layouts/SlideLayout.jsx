import { layout_map } from "./layout_map";

const SlideLayout = ({ layoutCategory, layoutType, content, hero, ...rest }) => {
    const Layout = layout_map[layoutCategory][layoutType];
    return <Layout content={content} hero={hero} {...rest} />;
};

export default SlideLayout;
