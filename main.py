from flask import *
import json
import utilities


app = Flask(__name__)


@app.route('/')
def root():
    vms_names = utilities.list_vms()
    running_vms_names = utilities.list_running_vms()
    vms = []
    for vm_name in vms_names:
        vm_obj = {}
        vm_obj['name'] = vm_name
        if running_vms_names is not None:
            if vm_name in running_vms_names:
                vm_obj['status'] = 'on'
            else:
                vm_obj['status'] = 'off'
        else:
            vm_obj['status'] = 'off'
        vm_info = utilities.vm_info(vm_name)
        vm_obj['cpus'] = vm_info['cpus']
        vm_obj['memory'] = vm_info['memory']
        if 'Forwarding(0)' in vm_info.keys():
            vm_obj['port'] = utilities.decode_port_forwarding(vm_info['Forwarding(0)'])['host_port']
        else:
            vm_obj['port'] = 'None'
        vms.append(vm_obj)
    return render_template('index.html', vms= vms)


@app.route('/refresh/<vm_name>')
def refresh(vm_name):
    vm_obj = {}
    vm_obj['name'] = vm_name
    running_vms = utilities.list_running_vms()
    if running_vms is not None:
        if vm_name in running_vms:
            vm_obj['status'] = 'on'
        else:
            vm_obj['status'] = 'off'
    else:
        vm_obj['status'] = 'off'
    vm_info = utilities.vm_info(vm_name)
    vm_obj['cpus'] = vm_info['cpus']
    vm_obj['memory'] = vm_info['memory']
    if 'Forwarding(0)' in vm_info.keys():
        vm_obj['port'] = utilities.decode_port_forwarding(vm_info['Forwarding(0)'])['host_port']
    else:
        vm_obj['port'] = 'None'
    return json.dumps(vm_obj)


@app.route('/start/<vm_name>')
def start(vm_name):
    vm_info = utilities.vm_info(vm_name)
    if 'Forwarding(0)' in vm_info.keys():
        result = utilities.start_vm(vm_name)
        if result:
            return json.dumps({'state': 'done', 'port': utilities.decode_port_forwarding(vm_info['Forwarding(0)'])['host_port']})
        else:
            return json.dumps({'state': 'fail', 'port': utilities.decode_port_forwarding(vm_info['Forwarding(0)'])['host_port']})
    else:
        vms_names = utilities.list_vms()
        vms_ports = []
        for name in vms_names:
            info = utilities.vm_info(name)
            if 'Forwarding(0)' in info.keys():
                port_forwarding = utilities.decode_port_forwarding(info['Forwarding(0)'])
                vms_ports.append(port_forwarding['host_port'])
        port = utilities.find_free_port(vms_ports)
        utilities.create_port_forwarding(vm_name, port)
        result = utilities.start_vm(vm_name)
        if result:
            return json.dumps({'state': 'done', 'port': port})
        else:
            return json.dumps({'state': 'fail', 'port': port})


@app.route('/shutdown/<vm_name>')
def shutdown(vm_name):
    result = utilities.shutdown_vm(vm_name)
    if result:
        return json.dumps({'state': 'done'})
    else:
        return json.dumps({'state': 'fail'})


@app.route('/modify', methods=['POST'])
def modify():
    result = utilities.modify_vm(request.form['name'], request.form['new_name'], int(request.form['memory']), int(request.form['cpus']))
    if result:
        return json.dumps({'state': 'done'})
    else:
        return json.dumps({'state': 'fail'})


@app.route('/remove/<vm_name>')
def remove(vm_name):
    result = utilities.remove_vm(vm_name)
    if result:
        return json.dumps({'state': 'done'})
    else:
        return json.dumps({'state': 'fail'})


@app.route('/clone', methods=['POST'])
def clone():
    src_vm_name = request.form['src']
    dest_vm_name = request.form['dest']
    result = utilities.clone_vm(src_vm_name, dest_vm_name)
    if result:
        dest_vm_info = utilities.vm_info(dest_vm_name)
        if 'Forwarding(0)' in dest_vm_info.keys():
            port_forwarding_details = utilities.decode_port_forwarding(dest_vm_info['Forwarding(0)'])
            temp_result = utilities.delete_port_forwarding(dest_vm_name, port_forwarding_details['name'])
            if temp_result:
                return json.dumps({'state': 'done'})
            else:
                return json.dumps({'state': 'fail'})
    else:
        return json.dumps({'state': 'fail'})


@app.route('/run', methods=['POST'])
def run():
    username = request.form['username']
    password = request.form['password']
    port = request.form['port']
    command = request.form['command']
    res, output, error = utilities.run_command(username, password, command, int(port))
    if res:
        return json.dumps({'state': 'done', 'output': str(output), 'error': str(error)})
    else:
        return json.dumps({'state': 'fail', 'output': output, 'error': str(error)})


if __name__ == '__main__':
    app.run(debug= True)


