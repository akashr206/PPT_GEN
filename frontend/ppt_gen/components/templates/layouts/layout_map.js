import BulletsBig from "./bullets/BulletsBig";
import BulletsStandard from "./bullets/BulletsStandard";
import BulletsGrid from "./bullets/BulletsGrid";
import BulletsTimeline from "./bullets/BulletsTimeline";

import CardsSimple from "./cards/CardsSimple";
import CardsLeftAccent from "./cards/CardsLeftAccent";
import CardsNumbered from "./cards/CardsNumbered";
import CardsFilled from "./cards/CardsFilled";

import StatsGrid from "./stats/StatsGrid";
import StatsRow from "./stats/StatsRow";
import StatsCallout from "./stats/StatsCallout";

import TimelineVertical from "./timelines/TimelineVertical";
import TimelineHorizontal from "./timelines/TimelineHorizontal";
import TimelineAlternating from "./timelines/TimelineAlternating";

import TitleMain from "./title/TitleMain";
import TitleSplit from "./title/TitleSplit";
import TitleSection from "./title/TitleSection";

export const layout_map = {
    "bullets": {
        "big": BulletsBig,
        "small": BulletsStandard,
        "standard": BulletsStandard,
        "grid": BulletsGrid,
        "timeline": BulletsTimeline,
    },
    "cards": {
        "simple": CardsSimple,
        "leftAccent": CardsLeftAccent,
        "numbered": CardsNumbered,
        "filled": CardsFilled,
    },
    "stats": {
        "grid": StatsGrid,
        "row": StatsRow,
        "callout": StatsCallout,
    },
    "timelines": {
        "vertical": TimelineVertical,
        "horizontal": TimelineHorizontal,
        "alternating": TimelineAlternating,
    },
    "title": {
        "main": TitleMain,
        "split": TitleSplit,
        "section": TitleSection,
    }
};