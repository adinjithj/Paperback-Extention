const fs = require('fs');
const path = require('path');

const versioningPath = path.join(__dirname, '..', 'bundles', 'versioning.json');

if (fs.existsSync(versioningPath)) {
    const versioning = JSON.parse(fs.readFileSync(versioningPath, 'utf8'));
    
    if (versioning.sources && Array.isArray(versioning.sources)) {
        versioning.sources.forEach(source => {
            if (!source.website) {
                source.website = source.websiteBaseURL || "https://github.com/adinjithj/Paperback-Extention";
            }
            source.intents = 39;
        });
    }
    
    versioning.builtWith = {
        "toolchain": "0.8.0-alpha.47",
        "types": "0.8.0-alpha.47"
    };
    
    fs.writeFileSync(versioningPath, JSON.stringify(versioning, null, 2));
    console.log('Successfully patched bundles/versioning.json');
} else {
    console.error('Could not find bundles/versioning.json');
    process.exit(1);
}
