function start(index) {
    name = document.getElementById("name-".concat(index)).innerHTML
    console.log("name : ".concat(name))
    console.log("index : ".concat(index))
    url = "start/".concat(name)
    xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            res = JSON.parse(xmlhttp.responseText)
            if (res.state == 'done') {
                document.getElementById("backdrop").style.display = "none"
                document.getElementById('spinner').style.display = "none"
                document.getElementById("port-".concat(index)).value = res.port
                document.getElementById("status-".concat(index)).innerHTML = "online"
                document.getElementById("status-".concat(index)).style.fontStyle = "normal"
                document.getElementById("status-".concat(index)).style.fontWeight = "bold"
                document.getElementById("status-".concat(index)).style.color = "green"
                document.getElementById("start-".concat(index)).disabled = true
                document.getElementById("shutdown-".concat(index)).disabled = false
                document.getElementById("command-".concat(index)).disabled = false
                document.getElementById("run-".concat(index)).disabled = false
                document.getElementById("clone-".concat(index)).disabled = true
                document.getElementById("modified-name-".concat(index)).disabled = true
                document.getElementById("memory-".concat(index)).disabled = true
                document.getElementById("cpus-".concat(index)).disabled = true
                document.getElementById("modify-".concat(index)).disabled = true
                document.getElementById("remove-".concat(index)).disabled = true
            } else if (res.state == 'fail') {

            }
        }
    }
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
    document.getElementById("backdrop").style.display = "block"
    document.getElementById('spinner').style.display = "block"
}

function shutdown(index) {
    name = document.getElementById("name-".concat(index)).innerHTML
    console.log("name : ".concat(name))
    console.log("index : ".concat(index))
    url = "shutdown/".concat(name)
    xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            res = JSON.parse(xmlhttp.responseText)
            if (res.state == 'done') {
                document.getElementById("status-".concat(index)).innerHTML = "offline"
                document.getElementById("status-".concat(index)).style.fontStyle = "italic"
                document.getElementById("status-".concat(index)).style.fontWeight = "normal"
                document.getElementById("status-".concat(index)).style.color = "orange"
                document.getElementById("start-".concat(index)).disabled = false
                document.getElementById("shutdown-".concat(index)).disabled = true
                document.getElementById("command-".concat(index)).disabled = true
                document.getElementById("run-".concat(index)).disabled = true
                document.getElementById("clone-".concat(index)).disabled = false
                document.getElementById("modified-name-".concat(index)).disabled = false
                document.getElementById("memory-".concat(index)).disabled = false
                document.getElementById("cpus-".concat(index)).disabled = false
                document.getElementById("modify-".concat(index)).disabled = false
                document.getElementById("remove-".concat(index)).disabled = false
            } else if (res.state == 'fail') {

            }
        }
    }
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
}

function modify(index, number_of_index) {
    console.log(index)
    console.log(number_of_index)
    name = document.getElementById("name-".concat(index)).innerHTML
    new_name = document.getElementById("modified-name-".concat(index)).value
    new_name_error = null
    for (let i = 0; i < number_of_index; i++) {
        console.log('current index : '.concat(i))
        console.log('name : '.concat(document.getElementById("name-".concat(i.toString())).innerHTML))
        console.log('index : '.concat(index))
        if (document.getElementById("name-".concat(i.toString())).innerHTML === new_name && i !== parseInt(index)) {
            console.log('Error')
            new_name_error = "This name has been reserved before";
            document.getElementById("modified-name-error-".concat(index)).innerHTML = new_name_error
            document.getElementById("modified-name-error-".concat(index)).style.display = "block"
            return null
        }
    }
    memory = document.getElementById("memory-".concat(index)).value
    console.log("memory : ".concat(memory))
    memory_error = null
    pattern = new RegExp("^[1-9][0-9]{0,3}$")
    if (pattern.test(memory) === false) {
        memory_error = "Please enter a numeric value between 1 to 9999"
        document.getElementById("memory-error-".concat(index)).innerHTML = memory_error
        document.getElementById("memory-error-".concat(index)).style.display = "block"
        return null;
    }
    cpus = document.getElementById("cpus-".concat(index)).value
    cpus_error = null
    pattern = new RegExp("^[1|2|3|4]$")
    if (pattern.test(cpus) === false) {
        cpus_error = "Please enter a numeric value between 1 to 4"
        document.getElementById("cpus-error-".concat(index)).innerHTML = cpus_error
        document.getElementById("cpus-error-".concat(index)).style.display = "block"
        return null
    }


    url = "modify"
    var data = new FormData()
    data.append('name', name)
    data.append('new_name', new_name)
    data.append('memory', memory)
    data.append('cpus', cpus)
    xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            res = JSON.parse(xmlhttp.responseText)
            if (res.state == 'done') {
                document.getElementById("name-".concat(index)).innerHTML = new_name
                document.getElementById("modified-name-".concat(index)).innerHTML = new_name
                document.getElementById("memory-".concat(index)).innerHTML = memory
                document.getElementById("cpus-".concat(index)).innerHTML = cpus
                document.getElementById("modified-name-error-".concat(index)).style.display = "none"
                document.getElementById("memory-error-".concat(index)).style.display = "none"
                document.getElementById("cpus-error-".concat(index)).style.display = "none"
                document.getElementById("inform-text").innerHTML = "vm modified successfully"
                document.getElementById("backdrop").style.display = "block"
                document.getElementById("inform-modal").style.display = "block"
                document.getElementById("inform-modal").className += "show"
            } else if (res.state == 'fail') {

            }
        }
    }
    xmlhttp.open("POST", url, true)
    xmlhttp.send(data)
}

function closeModal(modal_id) {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById(modal_id).style.display = "none"
    document.getElementById(modal_id).className += document.getElementById(modal_id).className.replace("show", "")
}

function delete_temp(index) {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("delete-modal").style.display = "block"
    document.getElementById("delete-modal").className += "show"
    document.getElementById("deleted-vm-name").innerHTML = "- ".concat(document.getElementById("name-".concat(index)).innerHTML)
    document.getElementById("deleted-vm-index").value = index
}

function delete_vm() {
    index = document.getElementById("deleted-vm-index").value
    name = document.getElementById("name-".concat(index)).innerHTML
    console.log('delete vm '.concat(name))
    url = "remove/" + name
    xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            res = JSON.parse(xmlhttp.responseText)
            if (res.state == 'done') {
                location.reload(true)
            } else if (res.state == 'fail') {

            }
        }
    }
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
}

function clone_temp(index, index_count) {
    document.getElementById("src-clone-vm").value = document.getElementById("name-".concat(index)).innerHTML
    document.getElementById("dest-clone-vm").value = document.getElementById("name-".concat(index)).innerHTML.concat(" Clone")
    document.getElementById("clone-vm-index").value = index
    document.getElementById("clone-vm-index-count").value = index_count
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("clone-modal").style.display = "block"
    document.getElementById("clone-modal").className += "show"
}

function clone_vm() {
    src_vm_name = document.getElementById("src-clone-vm").value
    dest_vm_name = document.getElementById("dest-clone-vm").value
    number_of_index = document.getElementById("clone-vm-index-count").value
    regex = new RegExp("^[_A-z0-9]*((-|\\s)*[_A-z0-9])*$")
    if (regex.test(dest_vm_name)) {
        for (let i = 0; i < parseInt(number_of_index); i++) {
            if (document.getElementById("name-".concat(i)).innerHTML === dest_vm_name) {
                document.getElementById("dest-clone-vm-error").innerHTML = "Clone virtual machine name can't be the same with other virtual machines name"
                document.getElementById("dest-clone-vm-error").style.display = "block"
                break
            }
        }
        var data = new FormData()
        data.append('src', src_vm_name)
        data.append('dest', dest_vm_name)
        url = "clone"
        xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                res = JSON.parse(xmlhttp.responseText)
                if (res.state == 'done') {
                    document.getElementById("dest-clone-vm-error").style.display = "none"
                    location.reload(true)
                    // closeModal("clone-modal")
                    // document.getElementById("inform-text").innerHTML = "It may take a few minutes to create your clone virtual machine. Please reload the page a few minutes later."
                    // document.getElementById("backdrop").style.display = "block"
                    // document.getElementById("inform-modal").style.display = "block"
                    // document.getElementById("inform-modal").className += "show"
                } else if (res.state == 'fail') {

                }
            }
        }
        xmlhttp.open("POST", url, true)
        xmlhttp.send(data)
        document.getElementById('clone-modal').style.display = "none"
        document.getElementById('clone-modal').className += document.getElementById('clone-modal').className.replace("show", "")
        document.getElementById('spinner').style.display = "block"
    } else {
        document.getElementById("dest-clone-vm-error").innerHTML = "Clone vm name must only contains alphanumeric characters"
        document.getElementById("dest-clone-vm-error").style.display = "block"
    }
}

function run_temp(index) {
    document.getElementById("run-vm-index").value = index
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("run-modal").style.display = "block"
    document.getElementById("run-modal").className += "show"
}

function run_command() {
    index = document.getElementById("run-vm-index").value
    port = document.getElementById("port-".concat(index)).value
    command = document.getElementById("command-".concat(index)).value
    username = document.getElementById("vm-user").value
    password = document.getElementById("vm-password").value
    url = "run"
    data = new FormData()
    data.append("username", username)
    data.append("password", password)
    data.append("command", command)
    data.append("port", port)
    xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            res = JSON.parse(xmlhttp.responseText)
            if (res.state == 'done') {
                document.getElementById("command-".concat(index)).value = ""
                document.getElementById("spinner").style.display = "none"
                if (res.output === "" && res.error !== "") {
                    document.getElementById("command-result-".concat(index)).value = res.error
                    document.getElementById("command-result-".concat(index)).style.color = "red"
                } else {
                    document.getElementById("command-result-".concat(index)).value = res.output
                    document.getElementById("command-result-".concat(index)).style.color = "green"
                }

                closeModal("run-modal")
            }
        }
    }
    xmlhttp.open("POST", url, true)
    xmlhttp.send(data)
    document.getElementById('run-modal').style.display = "none"
    document.getElementById('run-modal').className += document.getElementById('run-modal').className.replace("show", "")
    document.getElementById('spinner').style.display = "block"
}

function refresh(index) {
    name = document.getElementById("name-".concat(index)).innerHTML
    url = "refresh/".concat(name)
    xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            vm_obj = JSON.parse(xmlhttp.responseText)
            // console.log(res.name)
            // console.log(res.port)
            document.getElementById("modified-name-".concat(index)).innerHTML = vm_obj.name
            document.getElementById("cpus-".concat(index)).innerHTML = vm_obj.cpus
            document.getElementById("memory-".concat(index)).innerHTML = vm_obj.memory
            document.getElementById("command-".concat(index)).value = ""
            document.getElementById("command-result-".concat(index)).value = ""
            document.getElementById("port-".concat(index)).value = vm_obj.port
            if (vm_obj.status === "on") {
                document.getElementById("status-".concat(index)).innerHTML = "online"
                document.getElementById("status-".concat(index)).style.color = "green"
                document.getElementById("status-".concat(index)).style.fontWeight = "bold"
                document.getElementById("status-".concat(index)).style.fontStyle = "normal"
                document.getElementById("start-".concat(index)).disabled = true
                document.getElementById("shutdown-".concat(index)).disabled = false
                document.getElementById("clone-".concat(index)).disabled = true
                document.getElementById("remove-".concat(index)).disabled = true
                document.getElementById("modified-name-".concat(index)).disabled = true
                document.getElementById("memory-".concat(index)).disabled = true
                document.getElementById("cpus-".concat(index)).disabled = true
                document.getElementById("modify-".concat(index)).disabled = true
                console.log(vm_obj.port)
                console.log(typeof vm_obj.port)
                console.log(vm_obj.port === "None")
                if (vm_obj.port === "None" || vm_obj.port === "none") {
                    document.getElementById("command-".concat(index)).disabled = true
                    document.getElementById("run-".concat(index)).disabled = true
                } else {
                    document.getElementById("command-".concat(index)).disabled = false
                    document.getElementById("run-".concat(index)).disabled = false
                }
                document.getElementById("backdrop").style.display = "none"
                document.getElementById('spinner').style.display = "none"
            } else {
                document.getElementById("status-".concat(index)).innerHTML = "offline"
                document.getElementById("status-".concat(index)).style.color = "orange"
                document.getElementById("status-".concat(index)).style.fontStyle = "italic"
                document.getElementById("status-".concat(index)).style.fontWeight = "normal"
                document.getElementById("start-".concat(index)).disabled = false
                document.getElementById("shutdown-".concat(index)).disabled = true
                document.getElementById("clone-".concat(index)).disabled = false
                document.getElementById("remove-".concat(index)).disabled = false
                document.getElementById("modified-name-".concat(index)).disabled = false
                document.getElementById("memory-".concat(index)).disabled = false
                document.getElementById("cpus-".concat(index)).disabled = false
                document.getElementById("modify-".concat(index)).disabled = false
                document.getElementById("command-".concat(index)).disabled = true
                document.getElementById("run-".concat(index)).disabled = true
                document.getElementById("backdrop").style.display = "none"
                document.getElementById('spinner').style.display = "none"
            }
        }
    }
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
    document.getElementById("backdrop").style.display = "block"
    document.getElementById('spinner').style.display = "block"
}

