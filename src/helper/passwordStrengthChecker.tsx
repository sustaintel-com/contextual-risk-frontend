export const getPasswordStrength = (password: string) => {
    if (!password) return 0;

    const checks = {
        length6: password.length >= 6,
        length8: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    let score = Object.values(checks).filter(Boolean).length;

    //Restrict "Strong" unless ALL required conditions are met
    const allRequired =
        checks.lowercase &&
        checks.uppercase &&
        checks.number &&
        checks.special &&
        checks.length6;

    if (!allRequired) {
        score = Math.min(score, 4); // cap at Medium
    }

    return score; // max = 6
};

export const getStrengthLabel = (score: number) => {
    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
};

export const getStrengthWidth = (score: number) => {
    if (score <= 2) return "w-1/3";
    if (score <= 4) return "w-2/3";
    return "w-full";
};