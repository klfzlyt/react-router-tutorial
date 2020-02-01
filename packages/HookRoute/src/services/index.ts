import poiListMockData from "./mockData/poiList";
import poiDetailMockData from "./mockData/poiDetail";
import dishDetailMockData from "./mockData/dishDetail";
export async function getPoiList() {
  return JSON.parse(poiListMockData);
}

export async function getPoiDetail(id) {
  return poiDetailMockData;
}

export async function getDishDetailService(id) {
  return dishDetailMockData;
}
