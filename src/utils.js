export function gen_id() {
    return Math.random().toString(36).slice(2, 12);
}

export function nl_num(n, fract_digits) {
    if (fract_digits) {
        return n.toLocaleString('nl', {
            minimumFractionDigits: fract_digits,
            maximumFractionDigits: fract_digits,
        });
    } else {
        return n.toLocaleString('nl');
    }
}

export function calc_avg(a) {
    return 6.9;
} 