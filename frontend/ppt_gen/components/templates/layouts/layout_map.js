import BulletsSimple from "./bullets/BulletsSimple";
import BulletsGrid from "./bullets/BulletsGrid";

import CardsBasic from "./cards/CardsBasic";
import CardsImage from "./cards/CardsImage";

import IconsList from "./icons/IconsList";
import IconsGrid from "./icons/IconsGrid";

import StatsHighlight from "./stats/StatsHighlight";
import StatsGrid from "./stats/StatsGrid";

import PlainText from "./text/PlainText";
import LargeText from "./text/LargeText";

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
    },
    "stats": {
        "highlight": StatsHighlight,
        "grid": StatsGrid,
    }
};

// Aliases for singular/plural consistency
layout_map.bullet = layout_map.bullets;
layout_map.card = layout_map.cards;
layout_map.icon = layout_map.icons;
layout_map.stat = layout_map.stats;