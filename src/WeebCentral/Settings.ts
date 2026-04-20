import {
    Button,
    NavigationButton,
    RequestManager,
    SourceStateManager,
} from "paperback-extensions-common";

export const serverSettingsMenu = (
    stateManager: SourceStateManager
): NavigationButton => {
    return createNavigationButton({
        id: "server_settings",
        value: "",
        label: "Server Settings",
        form: createForm({
            onSubmit: async () => {},
            validate: async () => true,
            sections: async () => [
                createSection({
                    id: "information",
                    header: undefined,
                    rows: async () => [
                        createMultilineLabel({
                            label: "No settings",
                            value: "This source does not require configuration.",
                            id: "description",
                        }),
                    ],
                }),
            ],
        }),
    });
};

export const testServerSettingsMenu = (
    stateManager: SourceStateManager,
    requestManager: RequestManager
): NavigationButton => {
    return createNavigationButton({
        id: "test_settings",
        value: "",
        label: "Try settings",
        form: createForm({
            onSubmit: async () => {},
            validate: async () => true,
            sections: async () => [
                createSection({
                    id: "information",
                    header: "No connection test",
                    rows: async () => [
                        createLabel({
                            label: "No configuration required.",
                            value: "",
                            id: "description",
                        }),
                    ],
                }),
            ],
        }),
    });
};

export const resetSettingsButton = (
    stateManager: SourceStateManager
): Button => {
    return createButton({
        id: "reset",
        label: "Reset",
        value: "",
        onTap: () => {
            void stateManager;
        },
    });
};
