import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, AfterViewInit {
  @ViewChild('codeEl', { static: false }) codeEl: ElementRef;

  public form: FormGroup;
  public hostFile: string;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      domain: 'example.com',
      root: '/var/www/html'
    });

    this.form.valueChanges.subscribe(val => {
      this.updateCode();
      this.updateHostfile();
    });
    this.updateHostfile();
  }

  public ngAfterViewInit(): void {
    this.updateCode();
  }

  public updateCode(): void {
    const code = document.createElement('code');
    code.className = 'html';
    const text = document.createTextNode(`<VirtualHost *:80>
    ServerName ${ this.form.value.domain }
    ServerAlias www.${ this.form.value.domain }

    ServerAdmin webmaster@localhost
    DocumentRoot ${ this.form.value.root }

    ErrorLog $\{APACHE_LOG_DIR\}/error.log
    CustomLog $\{APACHE_LOG_DIR\}/access.log combined

    <Directory "${ this.form.value.root }">
      Options Indexes FollowSymLinks MultiViews
      Allow from all
      AllowOverride All
      Require all granted
      Options +Indexes
    </Directory>

  </VirtualHost>`);

    this.codeEl.nativeElement.innerHTML = '';
    code.appendChild(text);
    this.codeEl.nativeElement.appendChild(code);

  }

  public updateHostfile(): void {
    this.hostFile = `echo "127.0.0.1  ${ this.form.value.domain }" >> /etc/hosts`;
  }
}
