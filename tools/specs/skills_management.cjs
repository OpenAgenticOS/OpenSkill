'use strict';

const partA = require('./skills_management_part_a.cjs');
const partB = require('./skills_management_part_b.cjs');

module.exports = (build) => [...partA(build), ...partB(build)];
