sdedit
===

Generate sequence diagrams from clear text using sdedit, created by Markus Strauch, [http://sdedit.sourceforge.net/](http://sdedit.sourceforge.net/).

## Dependencies

This package **requires java** to be installed and put on your PATH environment variable, as this package is just a wrapper around the sdedit java application.

## Usage

To learn more about the awesome sdedit application, including the sdedit domain specific language (DSL), see [http://sdedit.sourceforge.net/](http://sdedit.sourceforge.net/).

This package can be used from the command line as well as programmatically. When installing this package, `sdedit update` is called automatically, which in turn downloads the `sdedit.jar` file, used to create your sequence diagrams. If that command failed for some reason, you can retry it yourself by running `sdedit update` (`./node_modules/.bin/sdedit update`).

### Command line interface (CLI)

```
Usage:
 sdedit update
 sdedit run
 sdedit run [arguments]

Download and run the sdedit jar.

Options:

 -h, --help     Output this help
 [arguments]    Any of the arguments documented here: http://sdedit.sourceforge.net/command_line/index.html

Examples:
 sdedit update
   Installs the sdedit.jar
 sdedit run
   Run the sdedit UI
 sdedit run -o /tmp/sequence.png -t png /tmp/examples/sequence.sd
   Creates /tmp/sequence.png based on the sequence diagram in /tmp/examples/sequence.sd.
```

### Programmatically

## TypeScript

This wrapper is created with TypeScript. Type definitions are included in the package.

### License

This package is licensed under Apache-2. The sdedit java application is created by Markus Strauch under the [BSD license](http://sdedit.sourceforge.net/copyright/index.html).
