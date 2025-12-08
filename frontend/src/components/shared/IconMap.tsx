import {
    FaBaseballBatBall,
    FaBicycle,
    FaBowlingBall,
    FaDumbbell,
    FaFootball,
    FaFutbol,
    FaGolfBallTee,
    FaPersonBiking,
    FaPersonRunning,
    FaPersonSkating,
    FaPersonSkiing,
    FaPersonSnowboarding,
    FaPersonSwimming,
    FaTableTennisPaddleBall,
    FaVolleyball,
} from "react-icons/fa6";
import { GiShuttlecock } from "react-icons/gi";
import { HelpCircle } from "lucide-react";
import React from "react";

export const iconMap: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
    futbol: FaFutbol,
    tableTennis: FaTableTennisPaddleBall,
    bicycle: FaBicycle,
    dumbbell: FaDumbbell,
    volleyball: FaVolleyball,
    swimming: FaPersonSwimming,
    running: FaPersonRunning,
    snowboarding: FaPersonSnowboarding,
    biking: FaPersonBiking,
    skiing: FaPersonSkiing,
    skating: FaPersonSkating,
    golf: FaGolfBallTee,
    football: FaFootball,
    bowlingBall: FaBowlingBall,
    baseballBatBall: FaBaseballBatBall,
    shuttlecock: GiShuttlecock,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name?: string;
}

export function Icon({ name, ...props }: IconProps) {
    if (!name) {
        return <HelpCircle {...props} />;
    }

    const IconComponent = iconMap[name];

    if (!IconComponent) {
        return <HelpCircle {...props} />;
    }

    return <IconComponent {...props} />;
}

export const availableIcons = Object.keys(iconMap);
