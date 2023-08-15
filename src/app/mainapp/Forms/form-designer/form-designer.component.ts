import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAlerts } from 'src/app/coreui/formio/components/alerts/formio.alerts';
import { FormContent } from 'src/app/models/FormContent';
import { FormContentService } from 'src/app/services/formContent.service';

@Component({
  selector: 'app-form-designer',
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.scss']
})
export class FormDesignerComponent {
  id: number;
  version: string;

  public form: any;
  public formContent: FormContent;
  public loading: Boolean;
  public formReady: Boolean;
  public editMode: Boolean;

  constructor(
    //public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute,
    private formContentService: FormContentService,
    //public config: FormManagerConfig,
    public ref: ChangeDetectorRef,
    public alerts: FormioAlerts,
    private snakbar: MatSnackBar
  ) {
    this.form = { components: [] };
    this.formReady = false;
    this.loading = false;
    this.editMode = false;
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.id = params['id'];
      this.version = params['version'];
      this.loadData();
    });


  }

  loadData() {

    this.formContentService.get_by_form_version(this.id, this.version).subscribe(results => {
      //this.loadEmptyMsg = true;
      this.formContent = results;
      console.log("formContent");
      console.log(this.formContent);
      //this.setForm();
      this.form = JSON.parse(this.formContent.formData);
    });

  }
  initBuilder(editing) {
    if (editing) {
      this.loading = true;
      this.editMode = true;

    } else {
      this.formReady = true;
      return Promise.resolve(true);
    }
  }

  onSave() {
    this.formContent.formData = JSON.stringify(this.form);
    console.log(this.form);
    // formId?: string;
    // formData?: string;
    // isPublish?: boolean;
    // version?: string;

    this.formContentService.edit(this.formContent).subscribe(results => {
      //this.loadEmptyMsg = true;
      this.formContent = results;
      console.log("formContent");
      console.log(this.formContent);

      this.snakbar.open('Form have updated successfully.', 'Ok', {
        duration: 2000,
      });

      //this.setForm();

    });
    //console.log(this.form);
  }
}
