import * as knockout from 'knockout';

import { ClientShared } from "client-shared-js";

import "./app.scss";
import { setInterval } from 'timers';

export interface AppViewModelProps {
}

export class AppViewModel {
    public currentString: KnockoutObservable<string>;

    constructor(params: AppViewModelProps) {
        this.currentString = knockout.observable("Mounting component...");

        const app = this;
        import("client-shared-js").then(foo => {
            if (foo != null) {
                app.currentString("Running create instance...");
            }
            foo.default({
                // Remember that the context here is the created module.
                // Further, this callback is called in the middle of construction, therefore
                // the variable shared is not ready.
                onRuntimeInitialized: function () {
                    app._setInstance(this);
                },
                locateFile: function (filename: string) {
                    if (filename === 'client-shared-js.mem') {
                        return "/node_modules/client-shared-js/ship/client-shared-js.mem"
                    }
                }
            });
        });
    }

    _setInstance(instance: ClientShared) {
        let stringFactory = new instance.StringFactory();
        setInterval(() => {
            this.currentString(stringFactory.getString());
        }, 1000);
    }
}