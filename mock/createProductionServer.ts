import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

import index from '../mock/mock';

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
    createProdMockServer([...index]);
}
