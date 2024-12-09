import shortid from 'shortid';

const generate_short_referral_code = () => {
    return 'ref_' + shortid.generate();
}

export { generate_short_referral_code };