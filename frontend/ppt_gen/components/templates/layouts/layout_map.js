import BulletsSimple from "./bullets/BulletsSimple";
import BulletsGrid from "./bullets/BulletsGrid";

import CardsBasic from "./cards/CardsBasic";
import CardsImage from "./cards/CardsImage";

import IconsList from "./icons/IconsList";
import IconsGrid from "./icons/IconsGrid";
import IconsCard from "./icons/IconsCard";

import StatsHighlight from "./stats/StatsHighlight";
import StatsGrid from "./stats/StatsGrid";

import PlainText from "./text/PlainText";
import LargeText from "./text/LargeText";

import TimelinesHorizontal from "./timelines/TimelinesHorizontal";
import TimelinesChevron from "./timelines/TimelinesChevron";
import TimelinesVertical from "./timelines/TimelinesVertical";

export const layout_map = {
    "text": {
        "plain": PlainText,
        "large": LargeText
    },
    "bullets": {
        "simple": BulletsSimple,
        "grid": BulletsGrid,
    },
    "cards": {
        "basic": CardsBasic,
        "image": CardsImage,
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
    }
};

// Aliases for singular/plural consistency
layout_map.bullet = layout_map.bullets;
layout_map.card = layout_map.cards;
layout_map.icon = layout_map.icons;
layout_map.stat = layout_map.stats;
layout_map.timeline = layout_map.timelines;