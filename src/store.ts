import * as foreingService from './services/foreign';
import * as nodeService from './services/node';
import * as ownerService from './services/owner';
import * as utilsService from './services/utils';
import model from './models';
import { createStore } from 'easy-peasy';

export interface Injections {
  nodeService: typeof nodeService;
  ownerService: typeof ownerService;
  utilsService: typeof utilsService;
  foreingService: typeof foreingService;
}

const store = createStore(model, {
  injections: {
    nodeService,
    ownerService,
    utilsService,
    foreingService,
  },
});

export default store;
