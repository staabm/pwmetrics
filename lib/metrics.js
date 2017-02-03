// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
'use strict';

const metricsDefinitions = require('lighthouse/lighthouse-core/lib/traces/pwmetrics-events.js').metricsDefinitions;

const metricsIds = {
  NAVSTART: 'navstart',
  TTFCP: 'ttfcp',
  TTFMP: 'ttfmp',
  PSI: 'psi',
  FV: 'fv',
  VC85: 'vc85',
  VC100: 'vc100',
  TTI: 'tti'
};

module.exports = {
  hiddenMetrics: [
    'fv',
    'vc',
    'vc85',
    'navstart'
  ],
  prepareData
};

function prepareData(res) {
  const audits = res.audits;

  const colorP0 = 'yellow';
  const colorP2 = 'green';
  const colorVisual = 'blue';

  const timings = [];
  metricsDefinitions.forEach(metric => {
    try {
      const resolvedMetric = {
        title: metric.name,
        name: metric.id,
        value: metric.getTs(audits)
      };

      switch (metric.id) {
        case metricsIds.TTFCP:
        case metricsIds.TTFMP:
          resolvedMetric.color = colorP2;
          break;
        case metricsIds.PSI:
        case metricsIds.FV:
        case metricsIds.VC85:
        case metricsIds.VC100:
          resolvedMetric.color = colorVisual;
          break;
        case metricsIds.TTI:
          resolvedMetric.color = colorP0;
          break;
      }

      timings.push(resolvedMetric);
    } catch (e) {
      console.error('pwmetrics-events', `${metric.name} timestamp not found: ${e.message}`);
    }
  });

  const timestamps = timings.filter(el => el[metricsIds.NAVSTART]);

  return {
    timings,
    timestamps,
    generatedTime: res.generatedTime,
    lighthouseVersion: res.lighthouseVersion,
    initialUrl: res.initialUrl,
    url: res.url
  };
}
