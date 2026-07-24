import BulletsSimple from "./bullets/BulletsSimple";
import BulletsGrid from "./bullets/BulletsGrid";
import BulletsNumbered from "./bullets/BulletsNumbered";
import BulletsAccent from "./bullets/BulletsAccent";

import CardsBasic from "./cards/CardsBasic";
import CardsOutline from "./cards/CardsOutline";
import CardsNumbered from "./cards/CardsNumbered";
import CardsAccent from "./cards/CardsAccent";

import ImagesSingle from "./basic/ImagesSingle";
import ImagesGallery from "./basic/ImagesGallery";

import IconsList from "./icons/IconsList";
import IconsGrid from "./icons/IconsGrid";
import IconsCard from "./icons/IconsCard";

import StatsHighlight from "./stats/StatsHighlight";
import StatsGrid from "./stats/StatsGrid";

import PlainText from "./basic/PlainText";
import LargeText from "./basic/LargeText";

import TimelinesHorizontal from "./timelines/TimelinesHorizontal";
import TimelinesChevron from "./timelines/TimelinesChevron";
import TimelinesVertical from "./timelines/TimelinesVertical";

import TableBasic from "./basic/TableBasic";
import CodeBlock from "./basic/CodeBlock";

import BarChartLayout from "./charts/BarChartLayout";
import LineChartLayout from "./charts/LineChartLayout";
import AreaChartLayout from "./charts/AreaChartLayout";
import PieChartLayout from "./charts/PieChartLayout";

export const layout_map = {
    "bullets": {
        "simple": BulletsSimple,
        "grid": BulletsGrid,
        "numbered": BulletsNumbered,
        "accent": BulletsAccent,
    },
    "cards": {
        "basic": CardsBasic,
        "outline": CardsOutline,
        "numbered": CardsNumbered,
        "accent": CardsAccent,
    },
    "icons": {
        "list": IconsList,
        "grid": IconsGrid,
        "card": IconsCard,
    },
    "stats": {
        "highlight": StatsHighlight,
        "grid": StatsGrid,
    },
    "timelines": {
        "horizontal": TimelinesHorizontal,
        "chevron": TimelinesChevron,
        "vertical": TimelinesVertical,
        "alternating": TimelinesVertical
    },
    "basic": {
        "table": TableBasic,
        "plain": PlainText,
        "large": LargeText,
        "single": ImagesSingle,
        "gallery": ImagesGallery,
        "code": CodeBlock
    },
    "charts": {
        "bar": BarChartLayout,
        "line": LineChartLayout,
        "area": AreaChartLayout,
        "pie": PieChartLayout
    }
};

// Aliases for singular/plural consistency
layout_map.bullet = layout_map.bullets;
layout_map.card = layout_map.cards;
layout_map.icon = layout_map.icons;
layout_map.stat = layout_map.stats;
layout_map.timeline = layout_map.timelines;
layout_map.chart = layout_map.charts;