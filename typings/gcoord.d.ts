// Type definitions for gcoord.js
declare var gcoord: {
  /**
   * 坐标转换
   */
  transform(
    /** geoJSON对象，或geoJSON字符串，或经纬度数组*/
    input: object | string | number[],
    /** CRS 当前坐标系 */
    from: string,
    /** CRS 目标坐标系 */
    to: string): Number[];
  /** WGS-84坐标系，GPS设备获取的经纬度坐标 */
  WGS84: string,
  /** GCJ-02坐标系，google中国地图、soso地图、aliyun地图、mapabc地图和高德地图所用的经纬度坐标 */
  GCJ02: string,
  /** BD-09坐标系，百度地图采用的经纬度坐标 */
  BD09: string,
  /** 百度坐标系，BD-09坐标系别名，同BD-09 */
  Baidu: string,
  /** 百度地图，BD-09坐标系别名，同BD-09 */
  BMap: string,
  /** 高德地图，同GCJ-02 */
  AMap: string,
  /** Web Mercator投影，墨卡托投影，同EPSG3857，单位：米 */
  WebMercator: string,
  /** WGS-84坐标系别名，同WGS-84 */
  WGS1984: string,
  /** WGS-84坐标系别名，同WGS-84 */
  EPSG4326: string,
  /** Web Mercator投影，同WebMercator，单位：米 */
  EPSG3857: string,
  /** Web Mercator投影，同WebMercator，单位：米 */
  EPSG900913: string,
}