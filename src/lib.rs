mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn mean(data: &[u16]) -> u16 {
    let sum: u16 = data.iter().sum();
    sum / (data.len() as u16)
}

fn variance(data: &[u16], mean: u16) -> u16 {
    let variance: u16 = data.iter().map(|&value| (value - mean).pow(2)).sum();
    variance / (data.len() as u16)
}

fn erf(x: f32) -> f32 {
    // constants
    let a1 = 0.254829592;
    let a2 = -0.284496736;
    let a3 = 1.421413741;
    let a4 = -1.453152027;
    let a5 = 1.061405429;
    let p = 0.3275911;

    let sign = if x < 0.0 { -1.0 } else { 1.0 };
    let x = x.abs();

    let t = 1.0 / (1.0 + p * x);
    let y = (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t;
    sign * (1.0 - y * (-x * x).exp())
}

#[wasm_bindgen]
pub fn t_test(left: &[u16], right: &[u16]) -> f32 {
    let mean_left = mean(left);
    let mean_right = mean(right);
    let variance_left = variance(left, mean_left);
    let variance_right = variance(right, mean_right);
    let pooled_variance = (variance_left + variance_right) / 2;
    let t_value = (mean_left - mean_right) as f64 / (pooled_variance as f64 * (1 as f64 / left.len() as f64 + 1 as f64 / right.len() as f64)).sqrt();
    let p = 1.0 - (0.5 + 0.5 * erf((t_value / 1.41) as f32));
    p
}
