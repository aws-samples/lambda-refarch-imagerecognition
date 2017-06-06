from __future__ import print_function  # Python 2/3 compatibility

import os, sys
import argparse

STATE_MACHINE_PLACEHOLDER_PATTERN = "##{{STATEMACHINE_DEF}}"


def usage():
    print('%s -s <state-machine-file> -c <cfn-file>' % os.path.basename(sys.argv[0]))


def main(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--state-machine-file', required=True, dest='state_machine')
    parser.add_argument('-c', '--cfn-file', required=True, dest='cfn_template')
    parser.add_argument('-o', '--output-file', dest='output', default="complete.yaml")
    args = parser.parse_args()

    s_file = vars(args)['state_machine']
    c_file = vars(args)['cfn_template']
    o_file = vars(args)['output']

    if not os.path.isfile(s_file):
        print("Error: can't find file: " + s_file)
        sys.exit(1)

    if not os.path.isfile(c_file):
        print("Error: can't find file: " + c_file)
        sys.exit(1)

    with open(c_file, "r") as raw_template:
        with open(o_file, "w") as fout:
            for line in raw_template:
                if STATE_MACHINE_PLACEHOLDER_PATTERN in line:
                    state_machine_def = open(s_file, "r")
                    for state_machine_line in state_machine_def:
                        fout.write('            ' + state_machine_line)
                    fout.write('\n')
                    print("placeholder pattern found and replaced.")
                else:
                    fout.write(line)


if __name__ == "__main__":
    main(sys.argv[1:])
