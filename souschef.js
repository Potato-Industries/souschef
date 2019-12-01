const chef = require("cyberchef");
const yargs = require('yargs');
const fs = require('fs');

function parseJSON (recipeFilePath) {
    var data = fs.readFileSync(recipeFilePath, 'utf8');
    return JSON.parse(data);
}

const argv = yargs
    .command('socket', 'socket outbound recipe (send), inbound recipe (recv) mode', {
        input: {
            description: 'input',
            alias: 'i',
            type: 'string',
        },
        encryptor: {
            description: 'file path to outbound recipe .json',
            alias: 'e',
            type: 'string',
        },
        decryptor: {
            description: 'file path to inbound recipe .json',
            alias: 'd',
            type: 'string',
        }
    })

    .command('core', 'stdin to stdout recipe mode', {
        recipe: {
            description: 'file path to recipe .json',
            alias: 'r',    
            type: 'string',
        },
        mode: {
            description: 'verbose on',
            alias: 'v',    
            type: 'bool',
        }

    })

    .help()
    .alias('help', 'h')
    .argv;

if (argv._.includes('core')) {
   if (!argv.recipe) {
      console.log("Error: Your souschef doesn't have the recipe!!");
   }
   if (!argv.v) {
      const input = fs.readFileSync('/dev/stdin').toString();
      const recipe = parseJSON(argv.recipe);
      process.stdout.write(chef.bake(input, recipe).toString());
   }
   else {
      const input = fs.readFileSync('/dev/stdin').toString();
      const recipe = parseJSON(argv.recipe);
      console.log("stdin: ");
      console.log(input);
      console.log("recipe: ");
      console.log(recipe);
      console.log("")
      console.log("stdout: ");
      console.log(chef.bake(input, recipe));
   }
}

else {
   console.log("The kitchen is closed..")
}
