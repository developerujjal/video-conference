const config = {
    port: 3030,
    workerSettings: {

        // rtcMinPort and rtcMaxPort are just arbitray port for our traffics
        // usefull for firewall and networking rules
        rtcMinPort: 40000,
        rtcMaxPort: 41000,

        // log level you want to set
        logLevel: 'warn',
        logTags: [
            'info',
            'ice',
            'dtls',
            'rtp',
            'strp',
            'rtcp'
        ]

    },
    routerMediaCodecs: [
        {
            kind: "audio",
            mimeType: "audio/opus",
            clockRate: 48000,
            channels: 2
        },
        {
            kind: "video",
            mimeType: "video/H264",
            clockRate: 90000,
            parameters:
            {
                "packetization-mode": 1,
                "profile-level-id": "42e01f",
                "level-asymmetry-allowed": 1
            }
        },
        {
            kind: "video",
            mimeType: "video/VP8",
            clockRate: 90000,
            parameters: {}
        }
    ],



};

module.exports = config;