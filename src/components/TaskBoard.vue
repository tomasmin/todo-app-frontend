<template>
  <div>
    <b-navbar>
      <b-navbar-nav class="ml-auto">
        <b-icon
          id="new-task-button"
          class="action-button"
          icon="plus-circle"
          v-b-modal.modal-create
          v-b-tooltip="'Create a new task'"
        ></b-icon>
      </b-navbar-nav>
    </b-navbar>
    <div class="main-wrp">
      <div class="todo-wrp">
        <h2>TO DO</h2>
        <draggable
          class="list-group task-column"
          :list="toDoList"
          group="tasks"
          @change="onChangeStatus($event)"
        >
          <div
            class="list-group-item todo-item"
            v-for="element in toDoList"
            :key="element.name"
            @click="passElementToModal(element)"
            v-b-modal.modal-task
          >
            <div class="item-name">
              {{ element.name }}
            </div>
            <div class="item-description">{{ element.description }}</div>
            <div class="item-actions">
              <b-icon
                class="action-button checkmark"
                icon="check2-square"
                @click.stop.prevent="taskDone(element.id)"
                v-b-tooltip="'Mark as done'"
              ></b-icon>
            </div>
          </div>
        </draggable>
      </div>

      <div class="divider"></div>

      <div class="done-wrp">
        <h2>DONE</h2>
        <draggable
          class="list-group task-column"
          :list="doneList"
          group="tasks"
        >
          <div
            class="list-group-item done-item"
            v-for="element in doneList"
            :key="element.name"
            @click="passElementToModal(element)"
            v-b-modal.modal-task
          >
            <div class="item-name">
              {{ element.name }}
            </div>
            <div class="item-description">{{ element.description }}</div>
          </div>
        </draggable>
      </div>

      <b-modal id="modal-task" :title="selectedTask.name" centered hide-footer>
        <div class="task-status">
          <div v-if="selectedTask.isDone">DONE</div>
          <div v-else>TO DO</div>
        </div>
        <div>
          {{ selectedTask.description }}
        </div>
        <div class="modal-actions">
          <b-icon
            v-if="!selectedTask.isDone"
            class="action-button checkmark"
            id="checkmark"
            icon="check2-square"
            @click="taskDone(selectedTask.id)"
            v-b-tooltip="'Mark as done'"
          ></b-icon>
          <b-icon
            class="action-button trashbin"
            id="trashbin"
            icon="trash"
            @click="deleteTask(selectedTask.id), $bvModal.hide('modal-task')"
            v-b-tooltip="'Delete task'"
          ></b-icon>
        </div>
      </b-modal>

      <b-modal id="modal-create" title="Create a task" hide-footer>
        <b-form @submit="onSubmit">
          <b-form-group
            id="name-input-group"
            label="Name:"
            label-for="name-input"
          >
            <b-form-input
              id="name-input"
              v-model="form.name"
              required
              placeholder="Enter name"
              maxlength="100"
            ></b-form-input>
            <div class="error-msg" v-if="nameError">{{ nameError }}</div>
          </b-form-group>

          <b-form-group
            id="description-input-group"
            label="Description:"
            label-for="description-input"
          >
            <b-form-input
              id="description-input"
              v-model="form.description"
              placeholder="Enter description (optional)"
            ></b-form-input>
          </b-form-group>

          <b-button id="submit-button" type="submit" variant="info"
            >Submit</b-button
          >
        </b-form>
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import draggable from "vuedraggable";
import axios from "axios";

@Component({
  components: {
    draggable,
  },
})
export default class TaskBoard extends Vue {
  API_URL = "http://127.0.0.1:5000";

  toDoList = [];
  doneList = [];

  form = {
    name: "",
    description: "",
  };

  nameError = null;

  selectedTask = { name: "", description: "", isDone: false };

  created() {
    axios
      .get(`${this.API_URL}/tasks`)
      .then((response) => {
        this.filterResponse(response);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  onChangeStatus(e: any) {
    let id;
    if (e.added) {
      id = e.added.element.id;
    } else if (e.removed) {
      id = e.removed.element.id;
    } else {
      return;
    }
    axios
      .put(`${this.API_URL}/tasks/${id}`)
      .then((response) => {
        this.filterResponse(response);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  filterResponse(response: any) {
    this.toDoList = response.data.filter((item: any) => item.is_done === false);
    this.doneList = response.data.filter((item: any) => item.is_done === true);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.nameError = null;
    axios
      .post(`${this.API_URL}/add`, this.form)
      .then((response) => {
        this.filterResponse(response);
        this.$bvModal.hide("modal-create");
        this.form = {
          name: "",
          description: "",
        };
      })
      .catch((error) => {
        if (error.response.data.name) {
          this.nameError = error.response.data.name;
        } else {
          alert("Something went wrong");
        }
      });
  }

  taskDone(id: number) {
    axios
      .put(`${this.API_URL}/tasks/${id}`)
      .then((response) => {
        this.filterResponse(response);
        this.selectedTask.isDone = true;
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  deleteTask(id: number) {
    axios
      .delete(`${this.API_URL}/tasks/${id}`)
      .then((response) => {
        this.filterResponse(response);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  passElementToModal(element: any) {
    this.selectedTask = element;
    this.selectedTask.isDone = element.is_done;
  }
}
</script>

<style scoped lang="scss">
$color-primary: #17a2b8;
$color-secondary: grey;
$color-todo: rgb(138, 12, 89);
$color-done: #7b7697e1;
$color-text-primary: white;
$color-warn: red;
$screen-small: 480px;
$screen-big: 1000px;
.navbar {
  max-width: $screen-big;
  margin: auto;
  height: 5em;
}
.main-wrp {
  display: inline-flex;
  width: 100%;
  max-width: $screen-big;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 2em;
  justify-content: space-between;
}
.todo-wrp,
.done-wrp {
  width: 45%;
  min-width: 220px;
  max-width: 600px;
  @media (max-width: $screen-small) {
    min-width: 180px;
  }
  h2 {
    font-weight: 600;
    color: $color-primary;
  }
}
.divider {
  border-right: 2px dotted $color-secondary;
}
.task-column {
  min-height: 300px;
  height: 100%;
}
.action-button {
  font-size: 3em;
  color: $color-secondary;
  cursor: pointer;
  transition: transform 0.2s;
}
.action-button:hover {
  transform: scale(1.3);
  color: $color-primary;
}
.checkmark,
.trashbin {
  color: $color-text-primary;
  font-size: 2em;
}
.checkmark:hover {
  color: $color-primary;
}
.list-group {
  flex-direction: column;
  @media (min-width: $screen-big) {
    flex-direction: unset;
    flex-wrap: wrap;
  }
}
.list-group-item {
  cursor: move;
  height: 200px;
  width: 200px;
  color: $color-text-primary;
  margin: 0.5em auto;
  border-radius: 5px;
  word-break: break-all;
  @media (max-width: $screen-big) {
    width: 90%;
  }
  .item-name {
    padding: 0.5em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.5em;
    font-weight: 500;
    @media (max-width: $screen-small) {
      font-size: 1.2em;
    }
  }
  .item-description {
    height: 5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    @media (max-width: $screen-small) {
      font-size: 0.8em;
    }
  }
  .item-actions {
    position: absolute;
    bottom: 5px;
    right: 10px;
  }
}
.todo-item {
  background-color: $color-todo;
}
.done-item {
  background-color: $color-done;
}
::v-deep .modal-content {
  word-break: break-all;
}
.modal-actions {
  float: right;
  margin-top: 0.5em;
  .checkmark,
  .trashbin {
    color: $color-secondary;
    margin-right: 0.2em;
  }
  .checkmark:hover {
    color: $color-primary;
  }
  .trashbin:hover {
    color: $color-warn;
  }
}
.task-status {
  font-size: 0.7em;
  color: $color-secondary;
}
.error-msg {
  color: $color-warn;
}
</style>
