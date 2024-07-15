export class Utils {
  /**
   * 2点間の距離から単位ベクトルを求める
   */
  static calcNormal(px: number, py: number, qx: number, qy: number) {
    const len = this.calcLength(px, py, qx, qy);
    const ux = (qx - px) / len;
    const uy = (qy - py) / len;
    return { ux, uy };
  }

  /**
   * 2点間の距離を求める
   */
  static calcLength(px: number, py: number, qx: number, qy: number) {
    return Math.sqrt((qx - px) * (qx - px) + (qy - py) * (qy - py));
  }

  /**
   * 単位ベクトルから角度（度数）を計算する
   */
  static calcAngleFromNormal(ux: number, uy: number) {
    const radians = Math.atan2(uy, ux);
    const degrees = radians * (180 / Math.PI);
    return degrees;
  }

  /**
   * 対象との距離を求める
   */
  static distance(px: number, py: number, qx: number, qy: number) {
    const x = qx - px;
    const y = qy - py;
    return Math.sqrt(x * x + y * y);
  }
}
