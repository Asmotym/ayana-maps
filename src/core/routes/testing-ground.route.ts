import type { RouteRecordRaw } from 'vue-router'
import QueriesTesting from '../layouts/QueriesTesting.vue'

export enum TestingGroundRoutes {
    Base = 'TestingGround'
}

export const routes: RouteRecordRaw[] = [
    {
        path: '/testing-ground',
        name: TestingGroundRoutes.Base,
        component: QueriesTesting
    }
]