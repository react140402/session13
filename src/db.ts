import { open } from "@op-engineering/op-sqlite";

export const db = open({
    name: 'myDB',
    location: '../databases',
});
