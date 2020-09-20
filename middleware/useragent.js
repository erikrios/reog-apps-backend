module.exports = function (req, res, next) {
    const { isMobile, isDesktop, isBot, browser, version, os, platform, source } = req.useragent;
    console.log({
        useragent: {
            isMobile,
            isDesktop,
            isBot,
            browser,
            version,
            os,
            platform,
            source
        }
    });
    
    next();
};