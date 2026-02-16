
export const TEAM_NAMES: Record<string, string> = {
    "Qatar": "Catar",
    "Ecuador": "Ecuador",
    "Senegal": "Senegal",
    "Netherlands": "Países Bajos",
    "England": "Inglaterra",
    "Iran": "Irán",
    "USA": "Estados Unidos",
    "Wales": "Gales",
    "Argentina": "Argentina",
    "Saudi Arabia": "Arabia Saudita",
    "Mexico": "México",
    "Poland": "Polonia",
    "France": "Francia",
    "Australia": "Australia",
    "Denmark": "Dinamarca",
    "Tunisia": "Túnez",
    "Spain": "España",
    "Costa Rica": "Costa Rica",
    "Germany": "Alemania",
    "Japan": "Japón",
    "Belgium": "Bélgica",
    "Canada": "Canadá",
    "Morocco": "Marruecos",
    "Croatia": "Croacia",
    "Brazil": "Brasil",
    "Serbia": "Serbia",
    "Switzerland": "Suiza",
    "Cameroon": "Camerún",
    "Portugal": "Portugal",
    "Ghana": "Ghana",
    "Uruguay": "Uruguay",
    "South Korea": "Corea del Sur",
    "United States": "Estados Unidos",
};

export const MATCH_STATUS: Record<string, string> = {
    "SCHEDULED": "PROGRAMADO",
    "TIMED": "PROGRAMADO",
    "IN_PLAY": "EN JUEGO",
    "PAUSED": "PAUSADO",
    "FINISHED": "FINALIZADO",
    "SUSPENDED": "SUSPENDIDO",
    "POSTPONED": "POSPUESTO",
    "CANCELLED": "CANCELADO",
    "AWARDED": "ADJUDICADO",
};

export const GROUPS: Record<string, string> = {
    "GROUP_A": "Grupo A",
    "GROUP_B": "Grupo B",
    "GROUP_C": "Grupo C",
    "GROUP_D": "Grupo D",
    "GROUP_E": "Grupo E",
    "GROUP_F": "Grupo F",
    "GROUP_G": "Grupo G",
    "GROUP_H": "Grupo H",
    "GROUP_I": "Grupo I",
    "GROUP_J": "Grupo J",
    "GROUP_K": "Grupo K",
    "GROUP_L": "Grupo L",
};

export const STAGES: Record<string, string> = {
    "GROUP_STAGE": "Fase de Grupos",
    "ROUND_OF_16": "Octavos de Final",
    "ROUND_OF_32": "Dieciseisavos de Final",
    "QUARTER_FINALS": "Cuartos de Final",
    "SEMI_FINALS": "Semifinales",
    "THIRD_PLACE": "Tercer Puesto",
    "FINAL": "Final",
};

export function translateTeam(name: string | null | undefined): string {
    if (!name) return "Por definirse";
    return TEAM_NAMES[name] || name;
}

export function translateStatus(status: string): string {
    return MATCH_STATUS[status] || status;
}

export function translateGroup(group: string | null): string {
    if (!group) return "Sin Grupo";
    return GROUPS[group] || group.replace('_', ' ');
}

export function translateStage(stage: string): string {
    return STAGES[stage] || stage;
}
