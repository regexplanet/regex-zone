

function processEnvOrThrow(envvar:string): string {

    const retVal = process.env[envvar];

    if (!retVal) {
        throw new Error(`Environment variable ${envvar} is not set`);
    }

    return retVal;
}

export {
    processEnvOrThrow
}