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
  public symlink: string;
  public enableConfig: string;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      domain: 'example.com',
      symlink: '/var/www/html/',
      root: '/home/user/websites/example.com/public',
      apache: '/etc/apache2/sites-available/',
    });

    this.form.valueChanges.subscribe(val => {
      this.updateCode();
      this.updateExtras();
    });
    this.updateExtras();
  }

  public ngAfterViewInit(): void {
    this.updateCode();
  }

  public updateCode(): void {
    const code = document.createElement('code');
    code.className = 'html';
    const text = document.createTextNode(`sudo sh -c 'echo "<VirtualHost *:80>
    ServerName ${ this.form.value.domain }
    ServerAlias www.${ this.form.value.domain }

    ServerAdmin webmaster@localhost
    DocumentRoot ${ this.form.value.symlink }${ this.form.value.domain }

    ErrorLog $\{APACHE_LOG_DIR\}/error.log
    CustomLog $\{APACHE_LOG_DIR\}/access.log combined

    <Directory "${ this.form.value.symlink }${ this.form.value.domain }">
      Options Indexes FollowSymLinks MultiViews
      Allow from all
      AllowOverride All
      Require all granted
      Options +Indexes
    </Directory>

  </VirtualHost>" > ${ this.form.value.apache }${ this.form.value.domain }.conf'`);

    this.codeEl.nativeElement.innerHTML = '';
    code.appendChild(text);
    this.codeEl.nativeElement.appendChild(code);

  }

  public updateExtras(): void {
    this.hostFile = `sudo sh -c 'echo "127.0.0.1  ${ this.form.value.domain }" >> /etc/hosts'`;
    this.symlink = `ln -s  ${ this.form.value.root } ${ this.form.value.symlink }${ this.form.value.domain }`;
    this.enableConfig = `sudo a2ensite ${ this.form.value.domain }.conf`;
  }
}
