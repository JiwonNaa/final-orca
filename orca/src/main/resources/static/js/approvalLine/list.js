//DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", function() {
    // jstree 노드에 draggable 속성 추가
    $('#jstree').on('loaded.jstree', function() {
        $(this).jstree('open_all');
        $('#jstree li a').attr('draggable', true);
    });

    // 드래그 시작 이벤트
    $(document).on('dragstart', '#jstree li a', function(event) {
        var nodeId = $(this).parent().attr('id');
        event.originalEvent.dataTransfer.setData('text/plain', nodeId);
    });

    // 초기 슬롯 생성
    createSlots();

    // 결재선 삭제 버튼 이벤트 바인딩
    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();  // 부모 요소 이벤트 전파 막기
        const apprLineNo = $(this).data('apprline-no');
        console.log('apprLine No:', apprLineNo);

        $.ajax({
            url: '/orca/apprline/delete',
            method: 'POST',
            data: { apprLineNo: apprLineNo },
            success: function(data) {
                console.log('apprLine deleted:', data);
                location.reload();
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });

    // 조직도 데이터를 가져오는 함수 호출
    fetchOrganization();

    // jstree 노드 선택 시 이벤트 핸들러
    $('#jstree').on("select_node.jstree", function (e, data) {
        var selectedNode = data.node;
        addApprovalSelection(selectedNode);
    });
});

//결재선 등록 팝업 드래그 앤 드롭 함수들
// 드래그 앤 드롭 이벤트를 허용하는 함수
function allowDrop(event) {
    event.preventDefault();
    event.target.classList.add('dragover');
}

// 드래그가 끝났을 때 스타일을 제거하는 함수
function removeDragover(event) {
    event.target.classList.remove('dragover');
}

// 드롭 이벤트가 발생했을 때 처리하는 함수
function drop(event) {
    event.preventDefault();
    removeDragover(event);
    var nodeId = event.dataTransfer.getData('text/plain');
    var node = $('#jstree').jstree('get_node', nodeId);

    if (node) {
        var slot = event.target.closest('.slot');
        if (slot && !slot.querySelector(`[data-id="${node.id}"]`)) {
            var existingNode = slot.querySelector('.employee');
            if (existingNode) {
                existingNode.remove();
            }

            var newNode = document.createElement('div');
            newNode.className = 'employee';
            newNode.textContent = `${node.id}: ${node.text}`;
            newNode.dataset.id = node.id;
            newNode.draggable = true;
            newNode.ondragstart = function(ev) {
                ev.dataTransfer.setData('text/plain', node.id);
            };

            // 삭제 버튼 추가
            var deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = function() {
                newNode.remove();
            };

            newNode.appendChild(deleteButton);
            slot.appendChild(newNode);
        }
    }
}

//결재자 및 합의자 슬롯 생성 함수
// 결재자 및 합의자 슬롯을 생성하는 함수
function createSlots() {
    var numSlots = 3; // 임시로 슬롯 개수 설정
    var approvalSelection = document.getElementById('approvalSelection');
    approvalSelection.innerHTML = '';

    for (var i = 0; i < numSlots; i++) {
        var slot = document.createElement('div');
        slot.className = 'slot';
        slot.ondrop = drop;
        slot.ondragover = allowDrop;
        slot.ondragleave = removeDragover;

        var label = document.createElement('div');
        label.className = 'slot-label';
        var select = document.createElement('select');
        select.className = 'role-select';
        select.innerHTML = '<option value="합의">합의</option><option value="결재">결재</option>';
        select.onchange = function() {
            label.textContent = select.value;
        };
        label.textContent = select.value;
        slot.appendChild(label);
        slot.appendChild(select);

        approvalSelection.appendChild(slot);
    }
}


//jstree 노드 선택 시 결재자/합의자 추가 함수
// 선택된 jstree 노드를 결재자 또는 합의자 슬롯에 추가하는 함수
function addApprovalSelection(node) {
    var approvalSelection = $('#approvalSelection');
    var newApproval = $('<div>').addClass('approval-item').text(node.text);
    approvalSelection.append(newApproval);
}


//결재선 등록 관련 함수들
// 결재선 등록 결재양식 제목 가져오기
function fetchTemplatesByCategory(categoryNo) {
    $.ajax({
        url: '/orca/apprline/template/list',
        method: 'GET',
        data: { categoryNo: categoryNo },
        success: function(templates) {
            const templateSelect = document.querySelector('#templateNo');
            templateSelect.innerHTML = '';
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.templateNo;
                option.text = template.title;
                templateSelect.appendChild(option);
            });
        },
        error: function(error) {
            console.error('Error fetching templates:', error);
        }
    });
}

// 결재선 등록 카테고리 가져오기
function fetchCategories() {
    $.ajax({
        url: '/orca/apprline/categorie/list',
        method: 'GET',
        success: function(categories) {
            const categorySelect = document.querySelector('#categoryNo');
            categorySelect.innerHTML = '';

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.categoryNo;
                option.text = category.categoryName;
                categorySelect.appendChild(option);
            });

            if (categories.length > 0) {
                fetchTemplatesByCategory(categories[0].categoryNo);
            }
        },
        error: function(error) {
            console.error('error:', error);
            console.log(error);
        }
    });
}

// 결재선 등록 조직도 가져오기
function fetchOrganization() {
    $.ajax({
        url: '/orca/apprline/organization/list',
        method: 'GET',
        success: function(data) {
            console.log("data:", data);
            const treeData = buildTreeData(data);
            console.log("treeData:", treeData);
            $('#jstree').jstree({
                'core' : {
                    'data' : treeData,
                    'themes' : {
                        'name': 'default',
                        'dots': false,
                        'icons': true
                    }
                }
            });
        },
        error: function(error) {
            console.error('error:', error);
        }
    });
}

// 조직도 데이터를 트리 구조로 변환하는 함수
function buildTreeData(data) {
    const tree = [];
    const departments = {};

    data.forEach(user => {
        if (!departments[user.partName]) {
            departments[user.partName] = {
                text: `${user.partName}`,
                icon: "fas fa-user-tie",
                state : { "opened" : true },
                children: []
            };
            tree.push(departments[user.partName]);
        }

        const department = departments[user.partName];

        let team = department.children.find(team => team.text.startsWith(user.teamName));
        if (!team) {
            team = {
                text: `${user.teamName}`,
                icon: "fas fa-folder",
                children: []
            };
            department.children.push(team);
        }

        const userNode = {
            id: `user_${user.empNo}`,
            text: `${user.name} [${user.nameOfPosition}]`,
            icon: "fas fa-user"
        };
        team.children.push(userNode);
    });

    return tree;
}


//팝업 관련 함수들

// 결재선 등록 팝업을 표시하는 함수
function showApprovalLinePopup() {
    document.querySelector('#popupOverlay').style.display = 'block';
    document.querySelector('#approvalLinePopup').style.display = 'block';
    fetchCategories();
    fetchOrganization();
}

// 결재선 등록 팝업을 닫는 함수
function closeApprovalLinePopup() {
    document.querySelector('#popupOverlay').style.display = 'none';
    document.querySelector('#approvalLinePopup').style.display = 'none';
}

// 결재선을 저장하는 함수
function saveApprovalLine(event) {
    event.preventDefault();
    let slots = document.querySelectorAll('.approval-selection .slot div[data-id]');
    let approvers = [];
    slots.forEach(function(slot) {
        approvers.push(slot.dataset.id);
    });

    $.ajax({
        url: '/orca/apprline/add',
        method: 'POST',
        data: {
            categoryNo: document.querySelector('#categoryNo').value,
            templateNo: document.querySelector('#templateNo').value,
            apprLineName: document.querySelector('#apprLineName').value,
            approvers: approvers
        },
        success: function(response) {
            alert('결재선이 저장되었습니다.');
            closeApprovalLinePopup();
            location.reload();
        },
        error: function() {
            alert('결재선 저장 중 오류가 발생했습니다.');
        }
    });
}

// 수정 팝업을 표시하는 함수
function openModal() {
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('approvalModal').style.display = 'block';
}

// 수정 팝업을 닫는 함수
function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('approvalModal').style.display = 'none';
}

// 수정 팝업에서 결재선을 저장하는 함수
function saveModalApprovalLine() {
    alert('결재선이 저장되었습니다.');
    closeModal();
}
