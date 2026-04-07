'use strict';

const part1 = require('./skills_ic_part1.cjs');
const part2 = require('./skills_ic_part2.cjs');
const part3 = require('./skills_ic_part3.cjs');

module.exports = (build) => [...part1(build), ...part2(build), ...part3(build)];
