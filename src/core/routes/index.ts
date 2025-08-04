import { HomeRoutes, routes as homeRoutes } from './home.route'
import { TestingGroundRoutes, routes as testingGroundRoutes } from './testing-ground.route'

export const coreRoutes = [...homeRoutes, ...testingGroundRoutes]

export {
    HomeRoutes,
    TestingGroundRoutes
}