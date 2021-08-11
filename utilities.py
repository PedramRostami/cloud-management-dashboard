import os, subprocess
import paramiko, socket
from random import randint


def list_vms():
    stream = os.popen('vboxmanage list vms')
    output = stream.read()
    if '"' in output:
        vms_raw_data = output.split('"')
        del vms_raw_data[0]
        vms = []
        for i in range(int(len(vms_raw_data) / 2)):
            vm_name = vms_raw_data[i * 2]
            # vm_id = vms_raw_data[i * 2 + 1].replace('\n', '').replace(' ', '').replace('{', '').replace('}', '')
            # vms.append([vm_name, vm_id])
            vms.append(vm_name)
        return vms
    else:
        return None


def list_running_vms():
    stream = os.popen('vboxmanage list runningvms')
    output = stream.read()
    if '"' in output:
        vms_raw_data = output.split('"')
        del vms_raw_data[0]
        running_vms = []
        for i in range(int(len(vms_raw_data) / 2)):
            vm_name = vms_raw_data[i * 2]
            vm_id = vms_raw_data[i * 2 + 1].replace('\n', '').replace(' ', '').replace('{', '').replace('}', '')
            # running_vms.append([vm_name, vm_id])
            running_vms.append(vm_name)
        return running_vms
    else:
        return None


def start_vm(name):
    try:
        running_vms = list_running_vms()
        if running_vms != None:
            if name not in running_vms:
                stream = os.popen('vboxmanage startvm "' + name + '"')
                output = stream.read()
                return True
            else:
                return True
        else:
            stream = os.popen('vboxmanage startvm "' + name + '"')
            output = stream.read()
            return True
    except:
        return False


def shutdown_vm(name):
    try:
        running_vms = list_running_vms()
        if running_vms != None:
            if name in running_vms:
                stream = os.popen('vboxmanage controlvm "' + name + '" acpipowerbutton')
                output = stream.read()
                return True
            else:
                return True
        else:
            return True
    except:
        return False


def modify_vm(name, new_name, ram, number_of_cpu):
    try:
        stream = os.popen(
            'vboxmanage modifyvm "' + name + '" --name "' + new_name + '" --memory ' + str(ram) + ' --cpus ' + str(
                number_of_cpu))
        return True
    except:
        return False


def vm_info(name):
    stream = os.popen('vboxmanage showvminfo "' + name + '" --machinereadable')
    output = stream.read()
    raw_data = output.split("\n")
    del raw_data[len(raw_data) - 1]
    info = {}
    for data in raw_data:
        info[data.split('=')[0]] = data.split('=')[1]
    return info


def clone_vm(name, clone_vm_name):
    try:
        p = subprocess.Popen('vboxmanage clonevm "' + name + '" --mode all --name "' + clone_vm_name + '" --register')
        p.communicate()
        return True
    except:
        return False


def remove_vm(name):
    try:
        stream = os.popen('vboxmanage unregistervm "' + name + '" --delete')
        output = stream.read()
        return True
    except:
        return False


def run_command(username, password, command, port):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect('localhost', username=username, password=password, port=port)
        ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command(command)
        output = ssh_stdout.read().decode('UTF-8')
        error = ssh_stderr.read().decode('UTF-8')
        return True, output, error
    except:
        return False, None, 'vm cannot run this command'


def find_free_port(vms_port):
    while True:
        port = randint(1024, 65353)
        if port not in vms_port:
            address = '127.0.0.1'
            s = socket.socket()
            try:
                s.connect((address, port))
                print('busy')
            except:
                print('free')
                return port
            finally:
                s.close()


def decode_port_forwarding(coded_forwarding):
    raw_data = coded_forwarding.replace('"', '').split(',')
    port_forwarding_rule = {}
    port_forwarding_rule['name'] = raw_data[0]
    port_forwarding_rule['protocol'] = raw_data[1]
    port_forwarding_rule['host_ip'] = raw_data[2]
    port_forwarding_rule['host_port'] = int(raw_data[3])
    port_forwarding_rule['guest_ip'] = raw_data[4]
    port_forwarding_rule['guest_port'] = int(raw_data[5])
    return port_forwarding_rule


def create_port_forwarding(vm_name, port):
    try:
        stream = os.popen(
            'vboxmanage modifyvm "' + vm_name + '" --natpf1 "guest_ssh,tcp,127.0.0.1,' + str(port) + ',10.0.2.15,22')
        output = stream.read()
        return True
    except:
        return False


def delete_port_forwarding(vm_name, port_forwarding_rule_name):
    try:
        stream = os.popen('vboxmanage modifyvm "' + vm_name + '" --natpf1 delete "' + port_forwarding_rule_name + '"')
        output = stream.read()
        return True
    except:
        return False


if __name__ == '__main__':
    clone_vm('VM1', 'VM2')
