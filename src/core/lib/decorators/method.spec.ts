import * as http from 'http';
import 'mocha';

import {
    AllHttpVerbsController,
    AllVerbController,
    HeadController,
    MultipleVerbDecoratorsController,
    RegExpController,
    SimpleController,
} from '../../test/lib/controllers';
import {port} from '../../test/lib/helpers';
import TestingServer from '../../test/lib/TestingServer';

let app: TestingServer;
let server: http.Server;

describe('Method Decorators', () => {
    before(() => {
        app = new TestingServer(false);
        app.addControllers([
            new AllHttpVerbsController(),
            new AllVerbController(),
            new HeadController(),
            new MultipleVerbDecoratorsController(),
            new SimpleController(),
            new RegExpController(),
        ]);
        server = app.start(port);
    });

    it('should allow any HTTP verb (except @Head) as a simple decorator', async () => {
        await AllHttpVerbsController.validateAll();
    });

    it('should allow multiple HTTP verb decorators', async () => {
        await MultipleVerbDecoratorsController.validateAll();
    });

    it('should allow @All to be used for all HTTP verbs', async () => {
        await AllVerbController.validateAll();
    });

    it('should use @Head function for HEAD when declared before @Get on the same route', async () => {
        await HeadController.validateHeadBeforeGet();
    });

    it('should use @Get function (w/o body) for HEAD when declared before @Head on the same route', async () => {
        await HeadController.validateGetBeforeHead();
    });

    it('should be able to decorate properties that are functions', async () => {
        await SimpleController.validateWrapperOnProperty();
    });

    describe('Regex', () => {
        it('should allow regex for the path', async () => {
            await RegExpController.validateAll();
        });
    });

    after(() => {
        server.close();
    });
});
