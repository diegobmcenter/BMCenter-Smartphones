import assert from'node:assert/strict';
import{adCoverageMetrics,capitalAllocation,profitabilityForPhone,purchaseSuggestion,smartActionQueue,stockAgingRows,turnoverByModel,buildOperationalTimeline}from'../src/businessIntelligence.js';

const profiles=[{id:'p1',name:'PATY',active:true},{id:'p2',name:'DIEGO',active:true}];
const sold={id:'s1',brand:'Samsung',model:'S23',date:'2026-07-01',paid:1000,otherCosts:50,parts:[{id:'part1',status:'Recebida',orderStatus:'Pedido entregue',effectiveCost:100}],status:'Vendido',sale:{soldAt:'2026-07-11',value:1700,marketplaceFee:50,shippingCost:50}};
const profit=profitabilityForPhone(sold);
assert.equal(profit.cost,1150);assert.equal(profit.revenue,1600);assert.equal(profit.profit,450);assert.ok(Math.abs(profit.marginPct-28.125)<.001);
const sold2={...sold,id:'s2',date:'2026-07-05',paid:900,parts:[{status:'Recebida',orderStatus:'Pedido entregue',effectiveCost:150}],otherCosts:0,sale:{soldAt:'2026-07-25',value:1650,marketplaceFee:0,shippingCost:50}};
const turnover=turnoverByModel([sold,sold2]);
assert.equal(turnover[0].qty,2);assert.equal(Math.round(turnover[0].avgDays),15);
const suggestion=purchaseSuggestion([sold,sold2],turnover[0].key,350);assert.ok(suggestion.maxPurchase>0);assert.equal(suggestion.samples,2);
const active={id:'a1',brand:'Apple',model:'iPhone 13',date:'2026-06-01',paid:2000,expected:2600,status:'Anunciado',lastActivityAt:'2026-07-01T00:00:00Z',expectedSaleDate:'2026-08-01',mediaLibrary:[{id:'m1'}],photoTarget:6,marketplaceProfiles:{p1:{active:true,publishedAt:'2026-07-10'}}};
const coverage=adCoverageMetrics([active],profiles);assert.equal(coverage.incomplete,1);assert.equal(coverage.coveragePct,50);
const aging=stockAgingRows([active],new Date('2026-08-16T12:00:00Z'));assert.equal(aging[0].severity,'critical');assert.ok(aging[0].purchaseDays>=70);
const actions=smartActionQueue([active],profiles,[],new Date('2026-08-16T12:00:00Z'));assert.ok(actions.some(x=>x.type==='coverage'));assert.ok(actions.some(x=>x.type==='stale'));assert.ok(actions.some(x=>x.type==='forecast'));
const capital=capitalAllocation([active]);assert.equal(capital.announced,2000);assert.equal(capital.total,2000);
const timeline=buildOperationalTimeline({...sold,mediaLibrary:[{id:'m',name:'frente.jpg',date:'2026-07-02T12:00:00Z'}]},[],profiles);assert.ok(timeline.some(x=>x.label==='Compra'));assert.ok(timeline.some(x=>x.label==='Foto'));assert.ok(timeline.some(x=>x.label==='Venda'));
console.log('intelligence-v1050.test: OK');
