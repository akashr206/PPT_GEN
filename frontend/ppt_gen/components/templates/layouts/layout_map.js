import BulletsBig from "./bullets/BulletsBig";
import BulletsStandard from "./bullets/BulletsStandard";
import BulletsGrid from "./bullets/BulletsGrid";
import BulletsNumbered from "./bullets/BulletsNumbered";

import CardsSimple from "./cards/CardsSimple";
import CardsLeftAccent from "./cards/CardsLeftAccent";
import CardsNumbered from "./cards/CardsNumbered";
import CardsFilled from "./cards/CardsFilled";

import StatsGrid from "./stats/StatsGrid";
import StatsCallout from "./stats/StatsCallout";

import TimelineHorizontal from "./timelines/TimelineHorizontal";
import TimelineChevron from "./timelines/TimelineChevron";

import TitleAsymmetric from "./title/TitleAsymmetric";
import TitleSplit from "./title/TitleSplit";
import TitleImage from "./title/TitleImage";

import IconsGrid from "./icons/IconsGrid";

import AgendaSplit from "./agenda/AgendaSplit";
import AgendaList from "./agenda/AgendaList";

import ImageSplit from "./images/ImageSplit";
import ImageGrid from "./images/ImageGrid";

import TableStriped from "./table/TableStriped";
import TableBordered from "./table/TableBordered";

import ClosingThankYou from "./closing/ClosingThankYou";
import ClosingQA from "./closing/ClosingQA";
import ClosingContact from "./closing/ClosingContact";

export const layout_map = {
    "bullets": {
        "big": BulletsBig,
        "small": BulletsStandard,
        "standard": BulletsStandard,
        "grid": BulletsGrid,
        "numbered": BulletsNumbered,
    },
    "cards": {
        "simple": CardsSimple,
        "leftAccent": CardsLeftAccent,
        "numbered": CardsNumbered,
        "filled": CardsFilled,
    },
    "stats": {
        "grid": StatsGrid,
        "callout": StatsCallout,
    },
    "timelines": {
        "horizontal": TimelineHorizontal,
        "chevron": TimelineChevron,
        "vertical": TimelineChevron,
        "alternating": TimelineChevron,
    },
    "title": {
        "asymmetric": TitleAsymmetric,
        "main": TitleAsymmetric,
        "split": TitleSplit,
        "image": TitleImage,
    },
    "icons": {
        "grid": IconsGrid,
        "row": IconsGrid,
        "list": IconsGrid,
    },
    "agenda": {
        "split": AgendaSplit,
        "list": AgendaList,
    },
    "images": {
        "split": ImageSplit,
        "grid": ImageGrid,
    },
    "table": {
        "striped": TableStriped,
        "bordered": TableBordered,
    },
    "closing": {
        "thankyou": ClosingThankYou,
        "qa": ClosingQA,
        "contact": ClosingContact,
    }
};

// Aliases for singular/plural consistency
layout_map.bullet = layout_map.bullets;
layout_map.card = layout_map.cards;
layout_map.stat = layout_map.stats;
layout_map.timeline = layout_map.timelines;
layout_map.icon = layout_map.icons;
layout_map.image = layout_map.images;
layout_map.table = layout_map.table;
layout_map.tables = layout_map.table;
layout_map.titles = layout_map.title;
layout_map.closings = layout_map.closing;
layout_map.agenda = layout_map.agenda;
layout_map.agendas = layout_map.agenda;